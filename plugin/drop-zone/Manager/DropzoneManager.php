<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Manager;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\Entity\Resource\AbstractResourceEvaluation;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\Resource\ResourceEvaluationManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\API\Serializer\CorrectionSerializer;
use Claroline\DropZoneBundle\API\Serializer\DocumentSerializer;
use Claroline\DropZoneBundle\API\Serializer\DropSerializer;
use Claroline\DropZoneBundle\API\Serializer\DropzoneSerializer;
use Claroline\DropZoneBundle\API\Serializer\DropzoneToolSerializer;
use Claroline\DropZoneBundle\Entity\Correction;
use Claroline\DropZoneBundle\Entity\Document;
use Claroline\DropZoneBundle\Entity\Drop;
use Claroline\DropZoneBundle\Entity\Dropzone;
use Claroline\DropZoneBundle\Entity\DropzoneTool;
use Claroline\DropZoneBundle\Entity\DropzoneToolDocument;
use Claroline\DropZoneBundle\Repository\DropRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @DI\Service("claroline.manager.dropzone_manager")
 */
class DropzoneManager
{
    /** @var Crud */
    private $crud;

    /** @var DropzoneSerializer */
    private $dropzoneSerializer;

    /** @var DropSerializer */
    private $dropSerializer;

    /** @var DocumentSerializer */
    private $documentSerializer;

    /** @var CorrectionSerializer */
    private $correctionSerializer;

    /** @var DropzoneToolSerializer */
    private $dropzoneToolSerializer;

    /** @var Filesystem */
    private $fileSystem;

    private $filesDir;

    /** @var ObjectManager */
    private $om;

    /**
     * @var ResourceEvaluationManager
     */
    private $resourceEvalManager;

    /** @var DropRepository */
    private $dropRepo;
    private $correctionRepo;
    private $dropzoneToolRepo;
    private $dropzoneToolDocumentRepo;

    /**
     * DropzoneManager constructor.
     *
     * @DI\InjectParams({
     *     "crud"                   = @DI\Inject("claroline.api.crud"),
     *     "dropzoneSerializer"     = @DI\Inject("claroline.serializer.dropzone"),
     *     "dropSerializer"         = @DI\Inject("claroline.serializer.dropzone.drop"),
     *     "documentSerializer"     = @DI\Inject("claroline.serializer.dropzone.document"),
     *     "correctionSerializer"   = @DI\Inject("claroline.serializer.dropzone.correction"),
     *     "dropzoneToolSerializer" = @DI\Inject("claroline.serializer.dropzone.tool"),
     *     "fileSystem"             = @DI\Inject("filesystem"),
     *     "filesDir"               = @DI\Inject("%claroline.param.files_directory%"),
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "resourceEvalManager"    = @DI\Inject("claroline.manager.resource_evaluation_manager")
     * })
     *
     * @param Crud                      $crud
     * @param DropzoneSerializer        $dropzoneSerializer
     * @param DropSerializer            $dropSerializer
     * @param DocumentSerializer        $documentSerializer
     * @param CorrectionSerializer      $correctionSerializer
     * @param DropzoneToolSerializer    $dropzoneToolSerializer
     * @param Filesystem                $fileSystem
     * @param string                    $filesDir
     * @param ObjectManager             $om
     * @param ResourceEvaluationManager $resourceEvalManager
     */
    public function __construct(
        Crud $crud,
        DropzoneSerializer $dropzoneSerializer,
        DropSerializer $dropSerializer,
        DocumentSerializer $documentSerializer,
        CorrectionSerializer $correctionSerializer,
        DropzoneToolSerializer $dropzoneToolSerializer,
        Filesystem $fileSystem,
        $filesDir,
        ObjectManager $om,
        ResourceEvaluationManager $resourceEvalManager
    ) {
        $this->crud = $crud;
        $this->dropzoneSerializer = $dropzoneSerializer;
        $this->dropSerializer = $dropSerializer;
        $this->documentSerializer = $documentSerializer;
        $this->correctionSerializer = $correctionSerializer;
        $this->dropzoneToolSerializer = $dropzoneToolSerializer;
        $this->fileSystem = $fileSystem;
        $this->filesDir = $filesDir;
        $this->om = $om;
        $this->resourceEvalManager = $resourceEvalManager;

        $this->dropRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Drop');
        $this->correctionRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Correction');
        $this->dropzoneToolRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\DropzoneTool');
        $this->dropzoneToolDocumentRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\DropzoneToolDocument');
    }

    /**
     * Serializes a Dropzone entity.
     *
     * @param Dropzone $dropzone
     *
     * @return array
     */
    public function serialize(Dropzone $dropzone)
    {
        return $this->dropzoneSerializer->serialize($dropzone);
    }

    /**
     * Serializes a Drop entity.
     *
     * @param Drop $drop
     *
     * @return array
     */
    public function serializeDrop(Drop $drop)
    {
        return $this->dropSerializer->serialize($drop);
    }

    /**
     * Serializes a Document entity.
     *
     * @param Document $document
     *
     * @return array
     */
    public function serializeDocument(Document $document)
    {
        return $this->documentSerializer->serialize($document);
    }

    /**
     * Serializes a Correction entity.
     *
     * @param Correction $correction
     *
     * @return array
     */
    public function serializeCorrection(Correction $correction)
    {
        return $this->correctionSerializer->serialize($correction);
    }

    /**
     * Serializes a Tool entity.
     *
     * @param DropzoneTool $tool
     *
     * @return array
     */
    public function serializeTool(DropzoneTool $tool)
    {
        return $this->dropzoneToolSerializer->serialize($tool);
    }

    /**
     * Updates a Dropzone.
     *
     * @param Dropzone $dropzone
     * @param array    $data
     *
     * @return Dropzone
     */
    public function update(Dropzone $dropzone, array $data)
    {
        $this->crud->update('Claroline\DropZoneBundle\Entity\Dropzone', $data);

        return $dropzone;
    }

    /**
     * Deletes a Dropzone.
     *
     * @param Dropzone $dropzone
     */
    public function delete(Dropzone $dropzone)
    {
        $this->om->startFlushSuite();
        $uuid = $dropzone->getUuid();
        $ds = DIRECTORY_SEPARATOR;
        $dropzoneDir = $this->filesDir.$ds.'dropzone'.$ds.$uuid;

        if ($this->fileSystem->exists($dropzoneDir)) {
            $this->fileSystem->remove($dropzoneDir);
        }
        $this->crud->delete($dropzone, 'Claroline\DropZoneBundle\Entity\Dropzone');
        $this->om->endFlushSuite();
    }

    /**
     * Gets user drop or create one.
     *
     * @param Dropzone $dropzone
     * @param User     $user
     * @param bool     $withCreation
     */
    public function getUserDrop(Dropzone $dropzone, User $user, $withCreation = false)
    {
        $drops = $this->dropRepo->findBy(['dropzone' => $dropzone, 'user' => $user]);
        $drop = count($drops) > 0 ? $drops[0] : null;

        if (empty($drop) && $withCreation) {
            $this->om->startFlushSuite();
            $drop = new Drop();
            $drop->setUser($user);
            $drop->setDropzone($dropzone);
            $this->om->persist($drop);
            $this->generateResourceEvaluation($dropzone, $user, AbstractResourceEvaluation::STATUS_INCOMPLETE);
            $this->om->endFlushSuite();
        }

        return $drop;
    }

    /**
     * Gets all user drops.
     *
     * @param Dropzone $dropzone
     * @param User     $user
     */
    public function getSerializedUserDrops(Dropzone $dropzone, User $user)
    {
        $serializedDrops = [];
        $drops = $this->dropRepo->findUserDrops($dropzone, $user);

        foreach ($drops as $drop) {
            $serializedDrops[] = $this->dropSerializer->serialize($drop);
        }

        return $serializedDrops;
    }

    /**
     * Deletes a Drop.
     *
     * @param Drop $drop
     */
    public function deleteDrop(Drop $drop)
    {
        $this->om->startFlushSuite();
        $documents = $drop->getDocuments();

        foreach ($documents as $document) {
            $this->deleteDocument($document);
        }
        $this->om->remove($drop);
        $this->om->endFlushSuite();
    }

    /**
     * Creates a Document.
     *
     * @param Drop  $drop
     * @param User  $user
     * @param int   $documentType
     * @param mixed $documentData
     */
    public function createDocument(Drop $drop, User $user, $documentType, $documentData)
    {
        $document = new Document();
        $document->setDrop($drop);
        $document->setUser($user);
        $document->setDropDate(new \DateTime());
        $document->setType($documentType);
        $data = $documentData;
        $document->setData($data);
        $this->om->persist($document);
        $this->om->flush();

        return $document;
    }

    /**
     * Creates Files Documents.
     *
     * @param Drop  $drop
     * @param User  $user
     * @param array $files
     */
    public function createFilesDocuments(Drop $drop, User $user, array $files)
    {
        $documents = [];
        $currentDate = new \DateTime();
        $dropzone = $drop->getDropzone();
        $this->om->startFlushSuite();

        foreach ($files as $file) {
            $document = new Document();
            $document->setDrop($drop);
            $document->setUser($user);
            $document->setDropDate($currentDate);
            $document->setType(Document::DOCUMENT_TYPE_FILE);
            $data = $this->registerFile($dropzone, $file);
            $document->setFile($data);
            $this->om->persist($document);
            $documents[] = $this->serializeDocument($document);
        }
        $this->om->endFlushSuite();

        return $documents;
    }

    /**
     * Deletes a Document.
     *
     * @param Document $document
     */
    public function deleteDocument(Document $document)
    {
        if ($document->getType() === Document::DOCUMENT_TYPE_FILE) {
            $data = $document->getFile();

            if (isset($data['url'])) {
                $this->fileSystem->remove($this->filesDir.DIRECTORY_SEPARATOR.$data['url']);
            }
        }
        $this->om->remove($document);
        $this->om->flush();
    }

    /**
     * Terminates a drop.
     *
     * @param Drop $drop
     */
    public function submitDrop(Drop $drop)
    {
        $this->om->startFlushSuite();
        $drop->setFinished(true);
        $drop->setDropDate(new \DateTime());
        $this->om->persist($drop);
        $this->checkCompletion($drop->getDropzone(), $drop->getUser(), $drop->getRole(), $drop);
        $this->om->endFlushSuite();
    }

    /**
     * Computes Drop score from submitted Corrections.
     *
     * @param Drop $drop
     *
     * @return Drop
     */
    public function computeDropScore(Drop $drop)
    {
        $corrections = $drop->getCorrections();
        $score = 0;
        $nbValidCorrection = 0;

        foreach ($corrections as $correction) {
            if ($correction->isFinished() && $correction->isValid()) {
                $score += $correction->getScore();
                ++$nbValidCorrection;
            }
        }
        $score = $nbValidCorrection > 0 ? round($score / $nbValidCorrection, 2) : null;
        $drop->setScore($score);
        $this->om->persist($drop);
        $this->om->flush();

        return $drop;
    }

    /**
     * Unlocks Drop.
     *
     * @param Drop $drop
     *
     * @return Drop
     */
    public function unlockDrop(Drop $drop)
    {
        $drop->setUnlockedDrop(true);
        $this->om->persist($drop);
        $this->om->flush();

        return $drop;
    }

    /**
     * Unlocks Drop user.
     *
     * @param Drop $drop
     *
     * @return Drop
     */
    public function unlockDropUser(Drop $drop)
    {
        $drop->setUnlockedUser(true);
        $this->om->persist($drop);
        $this->om->flush();

        return $drop;
    }

    /**
     * Cancels Drop submission.
     *
     * @param Drop $drop
     *
     * @return Drop
     */
    public function cancelDropSubmission(Drop $drop)
    {
        $drop->setFinished(false);
        $drop->setDropDate(null);
        $this->om->persist($drop);
        $this->om->flush();

        return $drop;
    }

    /**
     * Updates a Correction.
     *
     * @param array $data
     *
     * @return Correction
     */
    public function saveCorrection(array $data)
    {
        $this->om->startFlushSuite();
        $existingCorrection = $this->correctionRepo->findOneBy(['uuid' => $data['id']]);
        $isNew = empty($existingCorrection);
        $correction = $this->correctionSerializer->deserialize('Claroline\DropZoneBundle\Entity\Correction', $data);

        if (!$isNew) {
            $correction->setLastEditionDate(new \DateTime());
        }
        $correction = $this->computeCorrectionScore($correction);
        $this->om->persist($correction);
        $this->om->endFlushSuite();

        return $correction;
    }

    /**
     * Submits a Correction.
     *
     * @param Correction $correction
     *
     * @return Correction
     */
    public function submitCorrection(Correction $correction)
    {
        $this->om->startFlushSuite();

        $correction->setFinished(true);
        $correction->setEndDate(new \DateTime());
        $this->om->persist($correction);
        $this->om->forceFlush();
        $drop = $this->computeDropScore($correction->getDrop());
        $this->checkCompletion($drop->getDropzone(), $correction->getUser(), $correction->getRole());
        $this->checkSuccess($drop);

        $this->om->endFlushSuite();

        return $correction;
    }

    /**
     * Switch Correction validation.
     *
     * @param Correction $correction
     *
     * @return Correction
     */
    public function switchCorrectionValidation(Correction $correction)
    {
        $this->om->startFlushSuite();

        $correction->setValid(!$correction->isValid());
        $this->om->persist($correction);
        $drop = $this->computeDropScore($correction->getDrop());
        $this->checkSuccess($drop);

        $this->om->endFlushSuite();

        return $correction;
    }

    /**
     * Deletes a Correction.
     *
     * @param Correction $correction
     */
    public function deleteCorrection(Correction $correction)
    {
        $this->om->startFlushSuite();

        $drop = $correction->getDrop();
        $drop->removeCorrection($correction);
        $this->om->remove($correction);
        $drop = $this->computeDropScore($drop);
        $this->checkSuccess($drop);

        $this->om->endFlushSuite();
    }

    /**
     * Computes Correction score from criteria grades.
     *
     * @param Correction $correction
     *
     * @return Correction
     */
    public function computeCorrectionScore(Correction $correction)
    {
        $drop = $correction->getDrop();
        $dropzone = $drop->getDropzone();
        $criteria = $dropzone->getCriteria();

        if ($dropzone->isCriteriaEnabled() && count($criteria) > 0) {
            $score = 0;
            $criteriaIds = [];
            $scoreMax = $dropzone->getScoreMax();
            $total = ($dropzone->getCriteriaTotal() - 1) * count($criteria);
            $grades = $correction->getGrades();

            foreach ($criteria as $criterion) {
                $criteriaIds[] = $criterion->getUuid();
            }
            foreach ($grades as $grade) {
                $gradeCriterion = $grade->getCriterion();

                if (in_array($gradeCriterion->getUuid(), $criteriaIds)) {
                    $score += $grade->getValue();
                }
            }
            $score = round(($score / $total) * $scoreMax, 2);
            $correction->setScore($score);
        }
        $this->om->persist($correction);
        $this->om->flush();

        return $correction;
    }

    public function getSerializedTools()
    {
        $serializedTools = [];
        $tools = $this->dropzoneToolRepo->findAll();

        foreach ($tools as $tool) {
            $serializedTools[] = $this->dropzoneToolSerializer->serialize($tool);
        }

        return $serializedTools;
    }

    /**
     * Updates a Tool.
     *
     * @param array $data
     *
     * @return Tool
     */
    public function saveTool(array $data)
    {
        $tool = $this->dropzoneToolSerializer->deserialize('Claroline\DropZoneBundle\Entity\DropzoneTool', $data);
        $this->om->persist($tool);
        $this->om->flush();

        return $tool;
    }

    /**
     * Deletes a Tool.
     *
     * @param DropzoneTool $tool
     */
    public function deleteTool(DropzoneTool $tool)
    {
        $this->om->remove($tool);
        $this->om->flush();
    }

    /**
     * Gets drops corrected by user.
     *
     * @param Dropzone $dropzone
     * @param User     $user
     *
     * @return array
     */
    public function getUserFinishedPeerDrops(Dropzone $dropzone, User $user)
    {
        return $this->dropRepo->findUserFinishedPeerDrops($dropzone, $user);
    }

    /**
     * Gets drops corrected by role.
     *
     * @param Dropzone $dropzone
     * @param Role     $role
     *
     * @return array
     */
    public function getRoleFinishedPeerDrops(Dropzone $dropzone, Role $role)
    {
        return $this->dropRepo->findRoleFinishedPeerDrops($dropzone, $role);
    }

    /**
     * Gets a drop for peer evaluation.
     *
     * @param Dropzone $dropzone
     * @param User     $user
     *
     * @return Drop | null
     */
    public function getPeerDrop(Dropzone $dropzone, User $user, $withCreation = true)
    {
        $peerDrop = null;
        $userDrop = $this->dropRepo->findOneBy(['dropzone' => $dropzone, 'user' => $user, 'finished' => true]);

        if (!empty($userDrop)) {
            $unfinishedDrops = $this->dropRepo->findUserUnfinishedPeerDrop($dropzone, $user);

            if (count($unfinishedDrops) > 0) {
                $peerDrop = $unfinishedDrops[0];
            } else {
                $finishedDrops = $this->dropRepo->findUserFinishedPeerDrops($dropzone, $user);
                $nbCorrections = count($finishedDrops);

                if ($withCreation && $dropzone->isReviewEnabled() && $nbCorrections < $dropzone->getExpectedCorrectionTotal()) {
                    $peerDrop = $this->getAvailableDropForPeer($dropzone, $user);
                }
            }
        }

        return $peerDrop;
    }

    /**
     * Gets available drop for peer evaluation.
     *
     * @param Dropzone $dropzone
     * @param User     $user
     *
     * @return Drop | null
     */
    public function getAvailableDropForPeer(Dropzone $dropzone, User $user)
    {
        $peerDrop = null;
        $drops = $this->dropRepo->findUserAvailableDrops($dropzone, $user);
        $validDrops = [];

        foreach ($drops as $drop) {
            $corrections = $drop->getCorrections();

            if (count($corrections) < $dropzone->getExpectedCorrectionTotal()) {
                $validDrops[] = $drop;
            }
        }
        if (count($validDrops) > 0) {
            /* TODO: Randomize choice */
            $peerDrop = $validDrops[0];

            /* Creates empty correction */
            $correction = new Correction();
            $correction->setDrop($peerDrop);
            $correction->setUser($user);
            $currentDate = new \DateTime();
            $correction->setStartDate($currentDate);
            $correction->setLastEditionDate($currentDate);
            $peerDrop->addCorrection($correction);
            $this->om->persist($correction);
            $this->om->flush();
        }

        return $peerDrop;
    }

    /**
     * Executes a Tool on a Document.
     *
     * @param DropzoneTool $tool
     * @param Document     $document
     *
     * @return Document
     */
    public function executeTool(DropzoneTool $tool, Document $document)
    {
        if ($tool->getType() === DropzoneTool::COMPILATIO && $document->getType() === Document::DOCUMENT_TYPE_FILE) {
            $toolDocument = $this->dropzoneToolDocumentRepo->findOneBy(['tool' => $tool, 'document' => $document]);
            $toolData = $tool->getData();
            $compilatio = new \SoapClient($toolData['url']);

            if (empty($toolDocument)) {
                $documentData = $document->getFile();
                $params = [];
                $params[] = $toolData['key'];
                $params[] = utf8_encode($documentData['name']);
                $params[] = utf8_encode($documentData['name']);
                $params[] = utf8_encode($documentData['name']);
                $params[] = utf8_encode($documentData['mimeType']);
                $params[] = base64_encode(file_get_contents($this->filesDir.DIRECTORY_SEPARATOR.$documentData['url']));
                $idDocument = $compilatio->__call('addDocumentBase64', $params);
                $analysisParams = [];
                $analysisParams[] = $toolData['key'];
                $analysisParams[] = $idDocument;
                $compilatio->__call('startDocumentAnalyse', $analysisParams);
                $reportUrl = $compilatio->__call('getDocumentReportUrl', $analysisParams);

                if ($idDocument && $reportUrl) {
                    $this->createToolDocument($tool, $document, $idDocument, $reportUrl);
                }
            }
        }

        return $document;
    }

    public function createToolDocument(DropzoneTool $tool, Document $document, $idDocument, $reportUrl)
    {
        $toolDocument = new DropzoneToolDocument();
        $toolDocument->setTool($tool);
        $toolDocument->setDocument($document);
        $data = ['idDocument' => $idDocument, 'reportUrl' => $reportUrl];
        $toolDocument->setData($data);
        $this->om->persist($toolDocument);
        $this->om->flush();
    }

    public function checkCompletion(Dropzone $dropzone, User $user = null, Role $role = null, Drop $drop = null)
    {
        $fixedStatusList = [
            AbstractResourceEvaluation::STATUS_COMPLETED,
            AbstractResourceEvaluation::STATUS_PASSED,
            AbstractResourceEvaluation::STATUS_FAILED,
        ];

        $this->om->startFlushSuite();
        $users = !empty($user) ? [$user] : [];
        /* TODO: Do the same for Role */

        /* Get nb Correction */
        $isComplete = !$dropzone->isPeerReview() || (!empty($drop) && $drop->isUnlockedUser());

        if (!$isComplete) {
            $expectedCorrectionTotal = $dropzone->getExpectedCorrectionTotal();
            $finishedPeerDrops = $this->getUserFinishedPeerDrops($dropzone, $user);
            $isComplete = count($finishedPeerDrops) >= $expectedCorrectionTotal;
        }
        if ($isComplete) {
            foreach ($users as $user) {
                $userEval = $this->resourceEvalManager->getResourceUserEvaluation($dropzone->getResourceNode(), $user, false);

                if (!empty($userEval) && !in_array($userEval->getStatus(), $fixedStatusList)) {
                    $this->generateResourceEvaluation($dropzone, $user, AbstractResourceEvaluation::STATUS_COMPLETED);
                }
            }
        }
        $this->om->endFlushSuite();
    }

    public function checkSuccess(Drop $drop)
    {
        $this->om->startFlushSuite();

        $dropzone = $drop->getDropzone();
        $user = $drop->getUser();
        $users = !empty($user) ? [$user] : [];
        /* TODO: Do the same for Role */

        $computeStatus = !$dropzone->isPeerReview();

        if (!$computeStatus) {
            $nbValidCorrections = 0;
            $expectedCorrectionTotal = $dropzone->getExpectedCorrectionTotal();
            $corrections = $drop->getCorrections();

            foreach ($corrections as $correction) {
                if ($correction->isFinished() && $correction->isValid()) {
                    ++$nbValidCorrections;
                }
            }
            $computeStatus = $nbValidCorrections >= $expectedCorrectionTotal;
        }
        if ($computeStatus) {
            $score = $drop->getScore();
            $scoreToPass = $dropzone->getScoreToPass();
            $status = $score >= $scoreToPass ? AbstractResourceEvaluation::STATUS_PASSED : AbstractResourceEvaluation::STATUS_FAILED;

            foreach ($users as $user) {
                $this->generateResourceEvaluation($dropzone, $user, $status, $score, $drop);
            }
        }

        $this->om->endFlushSuite();
    }

    public function generateResourceUserEvaluation(Dropzone $dropzone, User $user)
    {
        $userEval = $this->resourceEvalManager->getResourceUserEvaluation($dropzone->getResourceNode(), $user, false);

        if (empty($userEval)) {
            $this->generateResourceEvaluation($dropzone, $user, AbstractResourceEvaluation::STATUS_NOT_ATTEMPTED);
        }

        return $userEval;
    }

    public function generateResourceEvaluation(Dropzone $dropzone, User $user, $status, $score = null, Drop $drop = null)
    {
        $data = !empty($drop) ? $this->serializeDrop($drop) : null;

        $this->resourceEvalManager->createResourceEvaluation(
            $dropzone->getResourceNode(),
            $user,
            new \DateTime(),
            $status,
            $score,
            null,
            $dropzone->getScoreMax(),
            null,
            null,
            null,
            $data,
            true
        );
    }

    public function getAllCorrectionsData(Dropzone $dropzone)
    {
        $data = [];
        $corrections = $this->correctionRepo->findAllCorrectionsByDropzone($dropzone);

        foreach ($corrections as $correction) {
            $user = $correction->getUser();
            $role = $correction->getRole();
            $serializedCorrection = $this->serializeCorrection($correction);

            if (!empty($user)) {
                $userId = $user->getId();

                if (!isset($data[$userId])) {
                    $data[$userId] = [];
                }
                $data[$userId][] = $serializedCorrection;
            }
            if (!empty($role)) {
                $roleName = $role->getName();

                if (!isset($data[$roleName])) {
                    $data[$roleName] = [];
                }
                $data[$roleName][] = $serializedCorrection;
            }
        }

        return $data;
    }

    private function registerFile(Dropzone $dropzone, UploadedFile $file)
    {
        $ds = DIRECTORY_SEPARATOR;
        $hashName = Uuid::uuid4()->toString();
        $dir = $this->filesDir.$ds.'dropzone'.$ds.$dropzone->getUuid();
        $fileName = $hashName.'.'.$file->getClientOriginalExtension();

        $file->move($dir, $fileName);

        return [
            'name' => $file->getClientOriginalName(),
            'mimeType' => $file->getClientMimeType(),
            'url' => '../files/dropzone'.$ds.$dropzone->getUuid().$ds.$fileName,
        ];
    }
}
