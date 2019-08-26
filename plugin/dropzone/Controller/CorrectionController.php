<?php
/**
 * Created by : Vincent SAISSET
 * Date: 22/08/13
 * Time: 09:30.
 */

namespace Icap\DropzoneBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use Icap\DropzoneBundle\Entity\Correction;
use Icap\DropzoneBundle\Entity\Drop;
use Icap\DropzoneBundle\Entity\Dropzone;
use Icap\DropzoneBundle\Entity\Grade;
use Icap\DropzoneBundle\Event\Log\LogCorrectionDeleteEvent;
use Icap\DropzoneBundle\Event\Log\LogCorrectionEndEvent;
use Icap\DropzoneBundle\Event\Log\LogCorrectionReportEvent;
use Icap\DropzoneBundle\Event\Log\LogCorrectionStartEvent;
use Icap\DropzoneBundle\Event\Log\LogCorrectionUpdateEvent;
use Icap\DropzoneBundle\Event\Log\LogCorrectionValidationChangeEvent;
use Icap\DropzoneBundle\Event\Log\LogDropGradeAvailableEvent;
use Icap\DropzoneBundle\Form\CorrectionCommentType;
use Icap\DropzoneBundle\Form\CorrectionDenyType;
use Icap\DropzoneBundle\Form\CorrectionStandardType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class CorrectionController extends DropzoneBaseController
{
    private function checkRightToCorrect(Request $request, $dropzone, $user)
    {
        $em = $this->getDoctrine()->getManager();
        // Check that the dropzone is in the process of peer review
        if (false === $dropzone->isPeerReview()) {
            $request->getSession()->getFlashBag()->add(
                'error',
                $this->get('translator')->trans('The peer review is not enabled', [], 'icap_dropzone')
            );

            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_open',
                    [
                        'resourceId' => $dropzone->getId(),
                    ]
                )
            );
        }

        // Check that the user has a finished dropzone for this drop.
        $userDrop = $em->getRepository('IcapDropzoneBundle:Drop')->findOneBy([
            'user' => $user,
            'dropzone' => $dropzone,
            'finished' => true,
        ]);
        if (null === $userDrop) {
            $request->getSession()->getFlashBag()->add(
                'error',
                $this->get('translator')->trans('You must have made your copy before correcting', [], 'icap_dropzone')
            );

            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_open',
                    [
                        'resourceId' => $dropzone->getId(),
                    ]
                )
            );
        }

        // Check that the user still make corrections
        $nbCorrection = $em->getRepository('IcapDropzoneBundle:Correction')->countFinished($dropzone, $user);
        if ($nbCorrection >= $dropzone->getExpectedTotalCorrection()) {
            $request->getSession()->getFlashBag()->add(
                'error',
                $this->get('translator')->trans('You no longer have any copies to correct', [], 'icap_dropzone')
            );

            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_open',
                    [
                        'resourceId' => $dropzone->getId(),
                    ]
                )
            );
        }

        return;
    }

    private function getCorrection($dropzone, $user)
    {
        $em = $this->getDoctrine()->getManager();
        // Check that the user as a not finished correction (exclude admin correction). Otherwise generate a new one.
        $correction = $em->getRepository('IcapDropzoneBundle:Correction')->getNotFinished($dropzone, $user);
        if (null === $correction) {
            $drop = $em->getRepository('IcapDropzoneBundle:Drop')->drawDropForCorrection($dropzone, $user);

            if (null !== $drop) {
                $correction = new Correction();
                $correction->setDrop($drop);
                $correction->setUser($user);
                $correction->setFinished(false);
                $correction->setDropzone($dropzone);

                $em->persist($correction);
                $em->flush();

                $event = new LogCorrectionStartEvent($dropzone, $drop, $correction);
                $this->dispatch($event);
            }
        } else {
            $correction->setLastOpenDate(new \DateTime());
            $em->persist($correction);
            $em->flush();
        }

        return $correction;
    }

    private function persistGrade($grades, $criterionId, $value, $correction)
    {
        $em = $this->getDoctrine()->getManager();

        $grade = null;
        $i = 0;
        while ($i < count($grades) && null === $grade) {
            $current = $grades[$i];
            if (
                $current->getCriterion()->getId() === $criterionId
                && $current->getCorrection()->getId() === $correction->getId()
            ) {
                $grade = $current;
            }
            ++$i;
        }

        if (null === $grade) {
            $criterionReference = $em->getReference('IcapDropzoneBundle:Criterion', $criterionId);
            $grade = new Grade();
            $grade->setCriterion($criterionReference);
            $grade->setCorrection($correction);
        }
        $grade->setValue($value);
        $em->persist($grade);
        $em->flush();

        return $grade;
    }

    private function endCorrection(Request $request, Dropzone $dropzone, Correction $correction, $admin)
    {
        $em = $this->getDoctrine()->getManager();

        $edit = false;
        if (true === $correction->getFinished()) {
            $edit = true;
        }

        $drop = $correction->getDrop();
        $correction->setEndDate(new \DateTime());
        $correction->setFinished(true);
        $totalGrade = $this->get('icap.manager.correction_manager')->calculateCorrectionTotalGrade($dropzone, $correction);
        $correction->setTotalGrade($totalGrade);

        $em->persist($correction);
        $em->flush();

        $event = null;
        if (true === $edit) {
            $event = new LogCorrectionUpdateEvent($dropzone, $correction->getDrop(), $correction);
        } else {
            $event = new LogCorrectionEndEvent($dropzone, $correction->getDrop(), $correction);
        }
        $this->dispatch($event);

        $request->getSession()->getFlashBag()->add(
            'success',
            $this->get('translator')->trans('Your correction has been saved', [], 'icap_dropzone')
        );

        // check if the drop owner can now access to his grade.
        $this->checkUserGradeAvailableByDrop($drop);

        if (true === $admin) {
            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_drops_detail',
                    [
                        'resourceId' => $dropzone->getId(),
                        'dropId' => $correction->getDrop()->getId(),
                    ]
                )
            );
        } else {
            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_open',
                    [
                        'resourceId' => $dropzone->getId(),
                    ]
                )
            );
        }
    }

    private function checkUserGradeAvailableByDrop(Drop $drop)
    {
        $user = $drop->getUser();
        $dropzone = $drop->getDropzone();
        $this->checkUserGradeAvailable($dropzone, $drop, $user);
    }

    /**
     * Check the user's drop to see if he has corrected enought copy and if his copy is fully corrected
     * in order to notify him that his grade is available.
     * */
    private function checkUserGradeAvailable(Dropzone $dropzone, Drop $drop, $user)
    {
        // notification only in the PeerReview mode.
        $em = $this->getDoctrine()->getManager();
        $event = new LogDropGradeAvailableEvent($dropzone, $drop);
        if (1 === $dropzone->getPeerReview()) {
            // copy corrected by user

            // corrections on the user's copy
            $nbCorrectionByOthersOnUsersCopy = $em->getRepository('IcapDropzoneBundle:Correction')->getCorrectionsIds($dropzone, $drop);

            //Expected corrections
            $expectedCorrections = $dropzone->getExpectedTotalCorrection();

            /**
             * $nbCorrectionByUser = $em->getRepository('IcapDropzoneBundle:Correction')->getAlreadyCorrectedDropIds($dropzone, $user);
             * if(count($nbCorrectionByUser) >=  $expectedCorrections && count($nbCorrectionByOthersOnUsersCopy) >= $expectedCorrections  ).
             **/
            // corrected copy only instead of corrected copy AND given corrections.
            if (count($nbCorrectionByOthersOnUsersCopy) >= $expectedCorrections) {
                //dispatchEvent.
                $this->get('event_dispatcher')->dispatch('log', $event);
            }
        } else {
            $nbCorrectionByOthersOnUsersCopy = $em->getRepository('IcapDropzoneBundle:Correction')
                ->getCorrectionsIds($dropzone, $drop);

            if ($nbCorrectionByOthersOnUsersCopy > 0) {
                $this->get('event_dispatcher')->dispatch('log', $event);
            }
        }
    }

    /* // MOVED TO CORRECTION MANAGER
        private function calculateCorrectionTotalGrade(Dropzone $dropzone, Correction $correction)
        {
            $correction->setTotalGrade(null);

            $nbCriteria = count($dropzone->getPeerReviewCriteria());
            $maxGrade = $dropzone->getTotalCriteriaColumn() - 1;
            $sumGrades = 0;
            foreach ($correction->getGrades() as $grade) {
                ($grade->getValue() > $maxGrade) ? $sumGrades += $maxGrade : $sumGrades += $grade->getValue();
            }

            $totalGrade = 0;
            if ($nbCriteria !== 0) {

                $totalGrade = $sumGrades / ($nbCriteria);
                $totalGrade = ($totalGrade * 20) / ($maxGrade);
            }

            return $totalGrade;
        }
    */

    /**
     * @Route(
     *      "/{resourceId}/correct/comment",
     *      name="icap_dropzone_correct_comment",
     *      requirements={"resourceId" = "\d+"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("user", options={
     *      "authenticatedUser" = true,
     *      "messageEnabled" = true,
     *      "messageTranslationKey" = "Correct an evaluation requires authentication. Please login.",
     *      "messageTranslationDomain" = "icap_dropzone"
     * })
     */
    public function correctCommentAction(Request $request, Dropzone $dropzone, User $user)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $check = $this->checkRightToCorrect($request, $dropzone, $user);
        if (null !== $check) {
            return $check;
        }

        $correction = $this->getCorrection($dropzone, $user);
        if (null === $correction) {
            $this
                ->getRequest()
                ->getSession()
                ->getFlashBag()
                ->add(
                    'error',
                    $this
                        ->get('translator')
                        ->trans('Unfortunately there is no copy to correct for the moment. Please try again later', [], 'icap_dropzone')
                );

            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_open',
                    [
                        'resourceId' => $dropzone->getId(),
                    ]
                )
            );
        }

        $pager = $this->getCriteriaPager($dropzone);
        $form = $this->createForm(CorrectionCommentType::class, $correction, ['allowCommentInCorrection' => $dropzone->getAllowCommentInCorrection()]);

        if ($request->isMethod('POST')) {
            $form->handleRequest($request);
            if ($form->isValid()) {
                $correction = $form->getData();

                if ($dropzone->getForceCommentInCorrection() && '' === $correction->getComment()) {
                    // field is required and not filled
                    $this
                        ->getRequest()
                        ->getSession()
                        ->getFlashBag()
                        ->add(
                            'error',
                            $this
                                ->get('translator')
                                ->trans('The comment field is required please let a comment', [], 'icap_dropzone')
                        );

                    return $this->redirect(
                        $this->generateUrl(
                            'icap_dropzone_correct_comment',
                            [
                                'resourceId' => $dropzone->getId(),
                            ]
                        )
                    );
                }
                $em = $this->getDoctrine()->getManager();
                $em->persist($correction);
                $em->flush();

                $goBack = $form->get('goBack')->getData();
                if (1 === $goBack) {
                    return $this->redirect(
                        $this->generateUrl(
                            'icap_dropzone_correct_paginated',
                            [
                                'resourceId' => $dropzone->getId(),
                                'page' => $pager->getNbPages(),
                            ]
                        )
                    );
                } else {
                    return $this->endCorrection($request, $dropzone, $correction, false);
                }
            }
        }

        $view = 'IcapDropzoneBundle:correction:correct_comment.html.twig';

        $totalGrade = $this->get('icap.manager.correction_manager')->calculateCorrectionTotalGrade($dropzone, $correction);

        $dropzoneManager = $this->get('icap.manager.dropzone_manager');
        $dropzoneProgress = $dropzoneManager->getDropzoneProgressByUser($dropzone, $user);

        return $this->render(
            $view,
            [
                'workspace' => $dropzone->getResourceNode()->getWorkspace(),
                '_resource' => $dropzone,
                'dropzone' => $dropzone,
                'correction' => $correction,
                'form' => $form->createView(),
                'nbPages' => $pager->getNbPages(),
                'admin' => false,
                'edit' => true,
                'totalGrade' => $totalGrade,
                'dropzoneProgress' => $dropzoneProgress,
            ]
        );
    }

    /**
     * @Route(
     *      "/{resourceId}/drops/detail/correction/standard/{state}/{correctionId}/{backUserId}",
     *      name="icap_dropzone_drops_detail_correction_standard",
     *      requirements={"resourceId" = "\d+", "correctionId" = "\d+", "state" = "show|edit", "backUserId" = "\d+"},
     *      defaults={"backUserId" = "-1"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("user", options={
     *      "authenticatedUser" = true,
     *      "messageEnabled" = true,
     *      "messageTranslationKey" = "Correct an evaluation requires authentication. Please login.",
     *      "messageTranslationDomain" = "icap_dropzone"
     * })
     */
    public function dropsDetailCorrectionStandardAction(Request $request, Dropzone $dropzone, $state, $correctionId, $user, $backUserId)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);

        /** @var Correction $correction */
        $correction = $this
            ->getDoctrine()
            ->getRepository('IcapDropzoneBundle:Correction')
            ->getCorrectionAndDropAndUserAndDocuments($dropzone, $correctionId);

        $edit = 'edit' === $state;

        if (true === $edit && false === $correction->getEditable()) {
            throw new AccessDeniedException();
        }

        $form = $this->createForm(CorrectionStandardType::class, $correction);

        if ($request->isMethod('POST')) {
            $form->handleRequest($request);
            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();

                $event = null;
                if (true === $correction->getFinished()) {
                    $event = new LogCorrectionUpdateEvent($dropzone, $correction->getDrop(), $correction);
                } else {
                    $event = new LogCorrectionEndEvent($dropzone, $correction->getDrop(), $correction);
                }

                $correction = $form->getData();
                $correction->setEndDate(new \DateTime());
                $correction->setFinished(true);

                $em->persist($correction);
                $em->flush();

                $this->dispatch($event);

                $event = new LogDropGradeAvailableEvent($dropzone, $correction->getDrop());
                $this->get('event_dispatcher')->dispatch('log', $event);

                $request->getSession()->getFlashBag()->add(
                    'success',
                    $this->get('translator')->trans('Your correction has been saved', [], 'icap_dropzone')
                );

                return $this->redirect(
                    $this->generateUrl(
                        'icap_dropzone_drops_detail',
                        [
                            'resourceId' => $dropzone->getId(),
                            'dropId' => $correction->getDrop()->getId(),
                        ]
                    )
                );
            }
        }

        $view = 'IcapDropzoneBundle:correction:correct_standard.html.twig';

        return $this->render(
            $view,
            [
                'workspace' => $dropzone->getResourceNode()->getWorkspace(),
                '_resource' => $dropzone,
                'dropzone' => $dropzone,
                'correction' => $correction,
                'form' => $form->createView(),
                'admin' => true,
                'edit' => $edit,
                'state' => $state,
                'backUserId' => $backUserId,
            ]
        );
    }

    /**
     * @Route(
     *      "/{resourceId}/drops/detail/correction/comment/{state}/{correctionId}",
     *      name="icap_dropzone_drops_detail_correction_comment",
     *      requirements={"resourceId" = "\d+", "correctionId" = "\d+", "state" = "show|edit|preview"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("user", options={
     *      "authenticatedUser" = true,
     *      "messageEnabled" = true,
     *      "messageTranslationKey" = "Correct an evaluation requires authentication. Please login.",
     *      "messageTranslationDomain" = "icap_dropzone"
     * })
     */
    public function dropsDetailCorrectionCommentAction(Request $request, Dropzone $dropzone, $state, $correctionId, $user)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        if ('preview' !== $state) {
            $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);
        }

        $correction = $this
            ->getDoctrine()
            ->getRepository('IcapDropzoneBundle:Correction')
            ->getCorrectionAndDropAndUserAndDocuments($dropzone, $correctionId);
        $edit = 'edit' === $state;

        if (true === $edit && false === $correction->getEditable()) {
            throw new AccessDeniedException();
        }

        $pager = $this->getCriteriaPager($dropzone);
        $form = $this->createForm(CorrectionCommentType::class, $correction, ['edit' => $edit, 'allowCommentInCorrection' => $dropzone->getAllowCommentInCorrection()]);

        if ($edit) {
            if ($request->isMethod('POST')) {
                $form->handleRequest($request);
                if ($form->isValid()) {
                    $em = $this->getDoctrine()->getManager();
                    $correction = $form->getData();
                    $em->persist($correction);
                    $em->flush();

                    $goBack = $form->get('goBack')->getData();
                    if (1 === $goBack) {
                        return $this->redirect(
                            $this->generateUrl(
                                'icap_dropzone_drops_detail_correction_paginated',
                                [
                                    'resourceId' => $dropzone->getId(),
                                    'state' => 'edit',
                                    'correctionId' => $correction->getId(),
                                    'page' => $pager->getNbPages(),
                                ]
                            )
                        );
                    } else {
                        return $this->endCorrection($request, $dropzone, $correction, true);
                    }
                }
            }

            $view = 'IcapDropzoneBundle:correction:correct_comment.html.twig';
            $totalGrade = $this->get('icap.manager.correction_manager')->calculateCorrectionTotalGrade($dropzone, $correction);

            return $this->render(
                $view,
                [
                    'workspace' => $dropzone->getResourceNode()->getWorkspace(),
                    '_resource' => $dropzone,
                    'dropzone' => $dropzone,
                    'correction' => $correction,
                    'form' => $form->createView(),
                    'nbPages' => $pager->getNbPages(),
                    'admin' => true,
                    'edit' => $edit,
                    'state' => $state,
                    'totalGrade' => $totalGrade,
                ]
            );
        }

        $view = 'IcapDropzoneBundle:correction:correct_comment.html.twig';

        if ('show' === $state) {
            $totalGrade = $this->get('icap.manager.correction_manager')->calculateCorrectionTotalGrade($dropzone, $correction);

            return $this->render(
                $view,
                [
                    'workspace' => $dropzone->getResourceNode()->getWorkspace(),
                    '_resource' => $dropzone,
                    'dropzone' => $dropzone,
                    'correction' => $correction,
                    'form' => $form->createView(),
                    'nbPages' => $pager->getNbPages(),
                    'admin' => true,
                    'edit' => $edit,
                    'state' => $state,
                    'totalGrade' => $totalGrade,
                ]
            );
        } elseif ('preview' === $state) {
            $totalGrade = $correction->getTotalGrade();

            return $this->render(
                $view,
                [
                    'workspace' => $dropzone->getResourceNode()->getWorkspace(),
                    '_resource' => $dropzone,
                    'dropzone' => $dropzone,
                    'correction' => $correction,
                    'form' => $form->createView(),
                    'nbPages' => $pager->getNbPages(),
                    'admin' => false,
                    'edit' => false,
                    'state' => $state,
                    'totalGrade' => $totalGrade,
                ]
            );
        }
    }

    /**
     * @Route(
     *      "/{resourceId}/drops/detail/{dropId}/add/correction",
     *      name="icap_dropzone_drops_detail_add_correction",
     *      requirements={"resourceId" = "\d+", "dropId" = "\d+"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("user", options={
     *      "authenticatedUser" = true,
     *      "messageEnabled" = true,
     *      "messageTranslationKey" = "Correct an evaluation requires authentication. Please login.",
     *      "messageTranslationDomain" = "icap_dropzone"
     * })
     * @ParamConverter("drop", class="IcapDropzoneBundle:Drop", options={"id" = "dropId"})
     */
    public function dropsDetailAddCorrectionAction($dropzone, $user, $drop)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);

        $em = $this->getDoctrine()->getManager();
        $correction = new Correction();
        $correction->setUser($user);
        $correction->setDropzone($dropzone);
        $correction->setDrop($drop);
        //Allow admins to edit this correction
        $correction->setEditable(true);
        $em->persist($correction);
        $em->flush();

        $event = new LogCorrectionStartEvent($dropzone, $drop, $correction);
        $this->dispatch($event);

        return $this->redirect(
            $this->generateUrl(
                'icap_dropzone_drops_detail_correction',
                [
                    'resourceId' => $dropzone->getId(),
                    'state' => 'edit',
                    'correctionId' => $correction->getId(),
                ]
            )
        );
    }

    /**
     * @Route(
     *      "/{resourceId}/delete/correction/{correctionId}/{backPage}",
     *      name="icap_dropzone_drops_detail_delete_correction",
     *      requirements={"resourceId" = "\d+", "correctionId" = "\d+"},
     *      defaults={"backPage" = "default"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("correction", class="IcapDropzoneBundle:Correction", options={"id" = "correctionId"})
     */
    public function deleteCorrectionAction(Request $request, Dropzone $dropzone, Correction $correction, $backPage)
    {
        $userId = $correction->getUser()->getId();
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);

        if (false === $correction->getEditable()) {
            throw new AccessDeniedException();
        }

        $dropId = $correction->getDrop()->getId();

        // Action on POST , real delete
        if ($request->isMethod('POST')) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($correction);
            $em->flush();

            $event = new LogCorrectionDeleteEvent($dropzone, $correction->getDrop(), $correction);
            $this->dispatch($event);

            $return = null;
            if ('AdminCorrectionsByUser' === $backPage) {
                $return = $this->redirect(
                    $this->generateUrl(
                        'icap_dropzone_drops_detail',
                        [
                            'resourceId' => $dropzone->getId(),
                            'dropId' => $dropId,
                        ]
                    )
                );
            } else {
                $return = $this->redirect(
                    $this->generateUrl(
                        'icap_dropzone_examiner_corrections',
                        [
                            'resourceId' => $dropzone->getId(),
                            'userId' => $userId,
                        ]
                    )
                );
            }
        } else {
            // Action on GET , Ask confirmation Modal or not.

            $view = 'IcapDropzoneBundle:correction:delete_correction.html.twig';
            $backUserId = 0;

            $backUserId = $request->get('backUserId');
            if ($request->isXmlHttpRequest()) {
                $view = 'IcapDropzoneBundle:correction:delete_correction_modal.html.twig';
                $backUserId = $correction->getUser()->getId();
            }

            $return = $this->render($view, [
                'workspace' => $dropzone->getResourceNode()->getWorkspace(),
                '_resource' => $dropzone,
                'dropzone' => $dropzone,
                'correction' => $correction,
                'drop' => $correction->getDrop(),
                'backPage' => 'AdminCorrectionsByUser',
                'backUserId' => $backUserId,
            ]);
        }

        return $return;
    }

    /**
     * @Route(
     *      "/{resourceId}/drops/detail/correction/validation/confirmation/{correctionId}/{value}",
     *      name="icap_dropzone_revalidateCorrection",
     *      requirements ={"resourceId" ="\d+","withDropOnly"="^(withDropOnly|all|withoutDrops)$"},
     *      defaults={"page" = 1, "withDropOnly" = "all", "value"="yes" }
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("correction", class="IcapDropzoneBundle:Correction", options={"id" = "correctionId"})
     */
    public function RevalidateCorrectionValidationAction(Request $request, Dropzone $dropzone, Correction $correction, $value)
    {
        // check if number of correction will be more than the expected.

        // only valid corrections are count
        if ($dropzone->getExpectedTotalCorrection() <= $correction->getDrop()->countFinishedCorrections()) {
            // Ask confirmation to have more correction than expected.
            $view = 'IcapDropzoneBundle:correction:admin/revalidate_correction.html.twig';
            if ($request->isXmlHttpRequest()) {
                $view = 'IcapDropzoneBundle:correction:admin/revalidate_correction_modal.html.twig';
            }

            return $this->render($view, [
                '_resource' => $dropzone,
                'dropzone' => $dropzone,
                'drop' => $correction->getDrop(),
                'correction' => $correction,
            ]);
        } else {
            $this->setCorrectionValidationAction($dropzone, $correction, 'yes', 'default');

            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_drops_detail',
                    [
                        'resourceId' => $dropzone->getId(),
                        'dropId' => $correction->getDrop()->getId(),
                    ]
                )
            );
        }
    }

    /**
     * @Route(
     *      "/{resourceId}/drops/detail/correction/validation/{value}/{correctionId}",
     *      name="icap_dropzone_drops_detail_correction_validation",
     *      requirements={"resourceId" = "\d+", "correctionId" = "\d+", "value" = "no|yes"},
     *      defaults={"routeParam"="default"}
     * )
     * @Route(
     *      "/{resourceId}/drops/detail/correction/validation/byUser/{value}/{correctionId}",
     *      name="icap_dropzone_drops_detail_correction_validation_by_user",
     *      requirements={"resourceId" = "\d+", "correctionId" = "\d+", "value" = "no|yes"},
     *      defaults={"routeParam"="byUser"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("correction", class="IcapDropzoneBundle:Correction", options={"id" = "correctionId"})
     */
    public function setCorrectionValidationAction(Dropzone $dropzone, Correction $correction, $value, $routeParam)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);

        $em = $this->getDoctrine()->getManager();

        if ('yes' === $value) {
            $correction->setValid(true);
            $correction->setFinished(true);
        } else {
            $correction->setValid(false);
        }

        $em->persist($correction);
        $em->flush();

        $event = new LogCorrectionValidationChangeEvent($dropzone, $correction->getDrop(), $correction);
        $this->dispatch($event);

        //Notify user his copy has an available note
        $this->checkUserGradeAvailableByDrop($correction->getDrop());

        if ('default' === $routeParam) {
            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_drops_detail',
                    [
                        'resourceId' => $dropzone->getId(),
                        'dropId' => $correction->getDrop()->getId(),
                    ]
                )
            );
        } elseif ('byUser' === $routeParam) {
            return $this->redirect(
                $this->generateUrl(
                    'icap_dropzone_examiner_corrections',
                    [
                        'resourceId' => $dropzone->getId(),
                        'userId' => $correction->getUser()->getId(),
                    ]
                )
            );
        }
    }

    /**
     * @Route(
     *      "/{resourceId}/drops/detail/{dropId}/invalidate_all",
     *      name="icap_dropzone_drops_detail_invalidate_all_corrections",
     *      requirements={"resourceId" = "\d+", "dropId" = "\d+"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("drop", class="IcapDropzoneBundle:Drop", options={"id" = "dropId"})
     */
    public function invalidateAllCorrectionsAction($dropzone, $drop)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);

        $this
            ->getDoctrine()
            ->getRepository('IcapDropzoneBundle:Correction')
            ->invalidateAllCorrectionForADrop($dropzone, $drop);

        //TODO invalidate all correction event

        return $this->redirect(
            $this->generateUrl(
                'icap_dropzone_drops_detail',
                [
                    'resourceId' => $dropzone->getId(),
                    'dropId' => $drop->getId(),
                ]
            )
        );
    }

    /**
     * @Route("/{resourceId}/drops/detail/correction/deny/{correctionId}",
     * name="icap_dropzone_drops_deny_correction",
     * requirements={"resourceId" = "\d+","correctionId" = "\d+"})
     *
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("correction", class="IcapDropzoneBundle:Correction", options={"id" = "correctionId"})
     **/
    public function denyCorrectionAction(Request $request, $dropzone, $correction)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $form = $this->createForm(CorrectionDenyType::class, $correction);

        $dropUser = $correction->getDrop()->getUser();
        $drop = $correction->getDrop();
        $dropId = $drop->getId();
        $dropzoneId = $dropzone->getId();
        // dropZone not in peerReview or corrections are not displayed to users or correction deny is not allowed
        if (!$dropzone->getPeerReview() || !$dropzone->getAllowCorrectionDeny() || !$dropzone->getDiplayCorrectionsToLearners()) {
            throw new AccessDeniedException();
        }
        // if loggued user is not the drop owner and is not admin.
        if (false === $this->get('security.authorization_checker')->isGranted('ROLE_ADMIN') && $this->get('security.token_storage')->getToken()->getUser()->getId() !== $dropUser->getId()) {
            throw new AccessDeniedException();
        }

        if ($request->isMethod('POST')) {
            $form->handleRequest($request);
            if ($form->isValid()) {
                $correction->setCorrectionDenied(true);
                $em = $this->getDoctrine()->getManager();
                $em->persist($correction);
                $em->flush();

                $this->dispatchCorrectionReportEvent($dropzone, $correction);
                $this
                    ->getRequest()
                    ->getSession()
                    ->getFlashBag()
                    ->add('success', $this->get('translator')->trans('Your report has been saved', [], 'icap_dropzone'));

                return $this->redirect(
                    $this->generateUrl(
                        'icap_dropzone_drop_detail_by_user',
                        [
                            'resourceId' => $dropzoneId,
                            'dropId' => $dropId,
                        ]
                    )
                );
            }
        }

        // not a post, she show the view.
        $view = 'IcapDropzoneBundle:correction:report_correction.html.twig';

        if ($request->isXmlHttpRequest()) {
            $view = 'IcapDropzoneBundle:correction:report_correction_modal.html.twig';
        }

        return $this->render($view, [
            'workspace' => $dropzone->getResourceNode()->getWorkspace(),
            '_resource' => $dropzone,
            'dropzone' => $dropzone,
            'drop' => $correction->getDrop(),
            'correction' => $correction,
            'form' => $form->createView(),
        ]);
    }

    protected function dispatchCorrectionReportEvent(Dropzone $dropzone, Correction $correction)
    {
        $drop = $correction->getDrop();
        $rm = $this->get('claroline.manager.role_manager');
        $event = new LogCorrectionReportEvent($dropzone, $drop, $correction, $rm);
        $this->get('event_dispatcher')->dispatch('log', $event);
    }

    /**
     * @Route(
     *      "/{resourceId}/recalculate/score/{correctionId}",
     *      name="icap_dropzone_recalculate_score",
     *      requirements={"resourceId" = "\d+", "correctionId" = "\d+"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "resourceId"})
     * @ParamConverter("correction", class="IcapDropzoneBundle:Correction", options={"id" = "correctionId"})
     */
    public function recalculateScoreAction(Dropzone $dropzone, Correction $correction)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);

        if (!$dropzone->getPeerReview()) {
            throw new AccessDeniedException();
        }

        $oldTotalGrade = $correction->getTotalGrade();

        $totalGrade = $this->get('icap.manager.correction_manager')->calculateCorrectionTotalGrade($dropzone, $correction);
        $correction->setTotalGrade($totalGrade);
        $em = $this->getDoctrine()->getManager();

        $em->persist($correction);
        $em->flush();

        if ($oldTotalGrade !== $totalGrade) {
            $event = new LogCorrectionUpdateEvent($dropzone, $correction->getDrop(), $correction);
            $this->dispatch($event);
        }

        return $this->redirect(
            $this->generateUrl(
                'icap_dropzone_drops_detail',
                [
                    'resourceId' => $dropzone->getId(),
                    'dropId' => $correction->getDrop()->getId(),
                ]
            )
        );
    }

    private function addCorrectionCount(Dropzone $dropzone, $users)
    {
        $correctionRepo = $this->getDoctrine()->getManager()->getRepository('IcapDropzoneBundle:Correction');
        $dropRepo = $this->getDoctrine()->getManager()->getRepository('IcapDropzoneBundle:Drop');
        $response = [];
        foreach ($users as $user) {
            $responseItem = [];
            $responseItem['userId'] = $user->getId();
            $corrections = $correctionRepo->getByDropzoneUser($dropzone->getId(), $user->getId());
            $isUnlockedDrop = $dropRepo->isUnlockedDrop($dropzone->getId(), $user->getId());
            $count = count($corrections);
            $responseItem['correction_count'] = $count;

            $finishedCount = 0;
            $reportsCount = 0;
            $deniedCount = 0;
            foreach ($corrections as $correction) {
                if ($correction->getCorrectionDenied()) {
                    ++$deniedCount;
                }
                if ($correction->getReporter()) {
                    ++$reportsCount;
                }
                if ($correction->getFinished()) {
                    ++$finishedCount;
                }
            }

            $responseItem['correction_deniedCount'] = $deniedCount;
            $responseItem['correction_reportCount'] = $reportsCount;
            $responseItem['correction_finishedCount'] = $finishedCount;
            $responseItem['drop_isUnlocked'] = $isUnlockedDrop;
            $response[$user->getId()] = $responseItem;
        }

        return $response;
    }

    /**
     * @Route(
     *      "/{dropId}/recalculateDropGrade",
     *      name="icap_dropzone_recalculate_drop_grade",
     *      requirements={"dropId" = "\d+"}
     * )
     * @ParamConverter("drop", class="IcapDropzoneBundle:Drop", options={"id" = "dropId"})
     */
    public function recalculateScoreByDropAction($drop)
    {
        $dropzone = $drop->getDropzone();
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);

        if (!$dropzone->getPeerReview()) {
            throw new AccessDeniedException();
        }
        // getting the repository
        $CorrectionRepo = $this->getDoctrine()->getManager()->getRepository('IcapDropzoneBundle:Correction');
        // getting all the drop corrections
        $corrections = $CorrectionRepo->findBy(['drop' => $drop->getId()]);

        $this->recalculateScoreForCorrections($dropzone, $corrections);

        return $this->redirect(
            $this->generateUrl(
                'icap_dropzone_drops_detail',
                [
                    'resourceId' => $dropzone->getId(),
                    'dropId' => $drop->getId(),
                ]
            )
        );
    }

    /**
     * @Route(
     *      "/{dropzone}/recalculateDropzoneGrades",
     *      name="icap_dropzone_recalculate_dropzone_grades",
     *      requirements={"dropId" = "\d+"}
     * )
     * @ParamConverter("dropzone", class="IcapDropzoneBundle:Dropzone", options={"id" = "dropzone"})
     */
    public function recalculateScoreByDropzoneAction($dropzone)
    {
        $this->get('icap.manager.dropzone_voter')->isAllowToOpen($dropzone);
        $this->get('icap.manager.dropzone_voter')->isAllowToEdit($dropzone);

        $this->get('icap.dropzone_manager')->recalculateScoreByDropzone($dropzone);

        return $this->redirect(
            $this->generateUrl(
                'icap_dropzone_edit_criteria',
                [
                    'resourceId' => $dropzone->getId(),
                ]
            )
        );
    }

    private function recalculateScoreForCorrections(Dropzone $dropzone, array $corrections)
    {
        // recalculate the score for all corrections
        foreach ($corrections as $correction) {
            $oldTotalGrade = $correction->getTotalGrade();
            $totalGrade = $this->get('icap.manager.correction_manager')->calculateCorrectionTotalGrade($dropzone, $correction);
            $correction->setTotalGrade($totalGrade);
            $em = $this->getDoctrine()->getManager();

            $em->persist($correction);
            $em->flush();

            $currentDrop = $correction->getDrop();
            if (null !== $currentDrop && $oldTotalGrade !== $totalGrade) {
                $event = new LogCorrectionUpdateEvent($dropzone, $currentDrop, $correction);
                $this->dispatch($event);
            }
        }
    }
}
