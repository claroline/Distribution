<?php

namespace FormaLibre\SupportBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\GenericDatasEvent;
use Claroline\CoreBundle\Manager\UserManager;
use FormaLibre\SupportBundle\Entity\Comment;
use FormaLibre\SupportBundle\Entity\Intervention;
use FormaLibre\SupportBundle\Entity\Status;
use FormaLibre\SupportBundle\Entity\Ticket;
use FormaLibre\SupportBundle\Entity\TicketUser;
use FormaLibre\SupportBundle\Entity\Type;
use FormaLibre\SupportBundle\Form\CommentEditType;
use FormaLibre\SupportBundle\Form\CommentType;
use FormaLibre\SupportBundle\Form\InterventionStatusType;
use FormaLibre\SupportBundle\Form\InterventionType;
use FormaLibre\SupportBundle\Form\PluginConfigurationType;
use FormaLibre\SupportBundle\Form\StatusType;
use FormaLibre\SupportBundle\Form\TicketTypeChangeType;
use FormaLibre\SupportBundle\Form\TypeType;
use FormaLibre\SupportBundle\Manager\SupportManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("canOpenAdminTool('formalibre_support_management_tool')")
 */
class AdminSupportController extends Controller
{
    private $eventDispatcher;
    private $formFactory;
    private $request;
    private $router;
    private $supportManager;
    private $translator;
    private $userManager;

    /**
     * @DI\InjectParams({
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "formFactory"     = @DI\Inject("form.factory"),
     *     "requestStack"    = @DI\Inject("request_stack"),
     *     "router"          = @DI\Inject("router"),
     *     "supportManager"  = @DI\Inject("formalibre.manager.support_manager"),
     *     "translator"      = @DI\Inject("translator"),
     *     "userManager"     = @DI\Inject("claroline.manager.user_manager")
     * })
     */
    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        FormFactory $formFactory,
        RequestStack $requestStack,
        RouterInterface $router,
        SupportManager $supportManager,
        TranslatorInterface $translator,
        UserManager $userManager
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->formFactory = $formFactory;
        $this->request = $requestStack->getCurrentRequest();
        $this->router = $router;
        $this->supportManager = $supportManager;
        $this->translator = $translator;
        $this->userManager = $userManager;
    }

    /**
     * @EXT\Route(
     *     "/admin/support/index/page/{page}/max/{max}/ordered/by/{orderedBy}/order/{order}/search/{search}",
     *     name="formalibre_admin_support_index",
     *     defaults={"page"=1, "search"="", "max"=50, "orderedBy"="creationDate","order"="DESC"},
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminSupportIndexAction($search = '', $page = 1, $max = 50, $orderedBy = 'creationDate', $order = 'DESC')
    {
        $tickets = $this->supportManager->getOngoingTickets($search, $orderedBy, $order, true, $page, $max);

        return [
            'tickets' => $tickets,
            'title' => 'ongoing_tickets',
            'supportType' => 'ongoing_tickets',
            'search' => $search,
            'page' => $page,
            'max' => $max,
            'orderedBy' => $orderedBy,
            'order' => $order,
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/support/type/{type}/tabs/active/{supportName}",
     *     name="formalibre_admin_support_type_tabs",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminSupportTabsAction(User $user, $type)
    {
        $ongoingTickets = $this->supportManager->getOngoingTickets('', 'id', 'ASC', false);
        $myTickets = $this->supportManager->getMyTickets($user, '', 'id', 'ASC', false);
        $closedTickets = $this->supportManager->getClosedTickets('', 'id', 'ASC', false);
        $forwardedTickets = $this->supportManager->getForwardedTickets('', 'id', 'ASC', false);
        $activeTicketUsers = $this->supportManager->getActiveTicketUserByUser($user);

        return [
            'supportType' => $type,
            'nbOngoingTickets' => count($ongoingTickets),
            'nbMyTickets' => count($myTickets),
            'nbClosedTickets' => count($closedTickets),
            'nbForwardedTickets' => count($forwardedTickets),
            'activeTicketUsers' => $activeTicketUsers,
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/support/my/tickets/page/{page}/max/{max}/ordered/by/{orderedBy}/order/{order}/search/{search}",
     *     name="formalibre_admin_support_my_tickets",
     *     defaults={"page"=1, "search"="", "max"=50, "orderedBy"="creationDate","order"="DESC"},
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminSupportMyTicketsAction(
        User $user,
        $search = '',
        $page = 1,
        $max = 50,
        $orderedBy = 'creationDate',
        $order = 'DESC'
    ) {
        $tickets = $this->supportManager->getMyTickets($user, $search, $orderedBy, $order, true, $page, $max);

        return [
            'tickets' => $tickets,
            'title' => 'my_tickets',
            'supportType' => 'my_tickets',
            'search' => $search,
            'page' => $page,
            'max' => $max,
            'orderedBy' => $orderedBy,
            'order' => $order,
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/support/archives/page/{page}/max/{max}/ordered/by/{orderedBy}/order/{order}/search/{search}",
     *     name="formalibre_admin_support_archives",
     *     defaults={"page"=1, "search"="", "max"=50, "orderedBy"="creationDate","order"="DESC"},
     *     options={"expose"=true}
     * )
     * @EXT\Template()
     */
    public function adminSupportArchivesAction(
        $search = '',
        $page = 1,
        $max = 50,
        $orderedBy = 'creationDate',
        $order = 'DESC'
    ) {
        $tickets = $this->supportManager->getClosedTickets($search, $orderedBy, $order, true, $page, $max);

        return [
            'tickets' => $tickets,
            'title' => 'archives',
            'supportType' => 'archives',
            'search' => $search,
            'page' => $page,
            'max' => $max,
            'orderedBy' => $orderedBy,
            'order' => $order,
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/support/forwarded/tickets/page/{page}/max/{max}/ordered/by/{orderedBy}/order/{order}/search/{search}",
     *     name="formalibre_admin_support_forwarded_tickets",
     *     defaults={"page"=1, "search"="", "max"=50, "orderedBy"="creationDate","order"="DESC"},
     *     options={"expose"=true}
     * )
     * @EXT\Template()
     */
    public function adminSupportForwardedTicketssAction(
        $search = '',
        $page = 1,
        $max = 50,
        $orderedBy = 'creationDate',
        $order = 'DESC'
    ) {
        $tickets = [];

        return [
            'tickets' => $tickets,
            'title' => 'forwarded_tickets',
            'supportType' => 'forwarded_tickets',
            'search' => $search,
            'page' => $page,
            'max' => $max,
            'orderedBy' => $orderedBy,
            'order' => $order,
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/support/types/management",
     *     name="formalibre_admin_support_types_management",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminSupportTypesManagementAction()
    {
        $types = $this->supportManager->getAllTypes('', 'id');

        return [
            'types' => $types,
            'title' => 'types_management',
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/support/status/management",
     *     name="formalibre_admin_support_status_management",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminSupportStatusManagementAction()
    {
        $allStatus = $this->supportManager->getAllStatus();

        return [
            'allStatus' => $allStatus,
            'title' => 'status_management',
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/support/contacts/management",
     *     name="formalibre_admin_support_contacts_management",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminSupportContactsManagementAction()
    {
        $contactIds = $this->supportManager->getConfigurationContactsOption();
        $contacts = $this->userManager->getUsersByIds($contactIds);

        return [
            'contacts' => $contacts,
            'title' => 'contacts_management',
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/{ticket}/open",
     *     name="formalibre_admin_ticket_open",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function adminTicketOpenAction(User $user, Ticket $ticket)
    {
        $this->supportManager->activateTicketUser($ticket, $user);

        return new RedirectResponse(
            $this->router->generate('formalibre_admin_ticket_display', ['ticket' => $ticket->getId()])
        );
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/{ticket}/display",
     *     name="formalibre_admin_ticket_display",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminTicketDisplayAction(Ticket $ticket)
    {
        return [
            'ticket' => $ticket,
            'title' => $ticket->getTitle(),
            'supportType' => $ticket->getId(),
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/{ticket}/delete",
     *     name="formalibre_admin_ticket_delete",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function adminTicketDeleteAction(Ticket $ticket)
    {
        $this->supportManager->deleteTicket($ticket);

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/{ticket}/closing",
     *     name="formalibre_ticket_closing",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function adminTicketClosingAction(User $user, Ticket $ticket)
    {
        $this->supportManager->closeTicket($ticket, $user);

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/user/{ticketUser}/close",
     *     name="formalibre_admin_ticket_user_close",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminTicketTabCloseAction(User $user, TicketUser $ticketUser)
    {
        if ($user->getId() !== $ticketUser->getUser()->getId()) {
            throw new AccessDeniedException();
        }
        $this->supportManager->deactivateTicketUser($ticketUser);

        return new RedirectResponse($this->router->generate('formalibre_admin_support_index'));
    }


    /**
     * #################################################################################################################
     * #################################################################################################################
     * #################################################################################################################
     */


//    /**
//     * @EXT\Route(
//     *     "/admin/support/configuration/menu",
//     *     name="formalibre_admin_support_configuration_menu",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template()
//     */
//    public function adminSupportConfigurationMenuAction()
//    {
//        return array();
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/support/contacts/{contactIds}/add",
//     *     name="formalibre_admin_support_contacts_add",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     */
//    public function adminSupportContactsAddAction($contactIds)
//    {
//        $config = $this->supportManager->getConfiguration();
//        $details = $config->getDetails();
//        $contacts = isset($details['contacts']) ? $details['contacts'] : array();
//        $toAdd = explode(',', $contactIds);
//
//        foreach ($toAdd as $userId) {
//            $contacts[] = intval($userId);
//        }
//        $details['contacts'] = $contacts;
//        $config->setDetails($details);
//        $this->supportManager->persistConfiguration($config);
//
//        return new JsonResponse('success', 200);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/support/contact/{contactId}/remove",
//     *     name="formalibre_admin_support_contact_remove",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     */
//    public function adminSupportContactRemoveAction($contactId)
//    {
//        $config = $this->supportManager->getConfiguration();
//        $details = $config->getDetails();
//
//        if (isset($details['contacts'])) {
//            $contacts = $details['contacts'];
//            $key = array_search($contactId, $contacts);
//
//            if ($key !== false) {
//                unset($contacts[$key]);
//                $details['contacts'] = $contacts;
//                $config->setDetails($details);
//                $this->supportManager->persistConfiguration($config);
//            }
//        }
//
//        return new JsonResponse('success', 200);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/support/type/{type}/new/page/{page}/max/{max}/ordered/by/{orderedBy}/order/{order}/search/{search}",
//     *     name="formalibre_admin_support_new",
//     *     defaults={"page"=1, "search"="", "max"=50, "orderedBy"="creationDate","order"="DESC"},
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template()
//     */
//    public function adminSupportNewAction(
//        Type $type,
//        $search = '',
//        $page = 1,
//        $max = 50,
//        $orderedBy = 'creationDate',
//        $order = 'DESC'
//    ) {
//        $tickets = $this->supportManager->getTicketsWithoutInterventionByLevel(
//            0,
//            $type,
//            $search,
//            $orderedBy,
//            $order,
//            true,
//            $page,
//            $max
//        );
//
//        return array(
//            'tickets' => $tickets,
//            'type' => $type,
//            'supportName' => 'new',
//            'search' => $search,
//            'page' => $page,
//            'max' => $max,
//            'orderedBy' => $orderedBy,
//            'order' => $order,
//        );
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/support/type/{type}/level/{level}/page/{page}/max/{max}/ordered/by/{orderedBy}/order/{order}/search/{search}",
//     *     name="formalibre_admin_support_level",
//     *     defaults={"page"=1, "search"="", "max"=50, "orderedBy"="creationDate","order"="DESC"},
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template()
//     */
//    public function adminSupportLevelAction(
//        Type $type,
//        $level,
//        $search = '',
//        $page = 1,
//        $max = 50,
//        $orderedBy = 'creationDate',
//        $order = 'DESC'
//    ) {
//        $tickets = $this->supportManager->getTicketsByLevel(
//            $type,
//            $level,
//            $search,
//            $orderedBy,
//            $order,
//            true,
//            $page,
//            $max
//        );
//
//        return array(
//            'tickets' => $tickets,
//            'type' => $type,
//            'level' => $level,
//            'supportName' => 'level_'.$level,
//            'search' => $search,
//            'page' => $page,
//            'max' => $max,
//            'orderedBy' => $orderedBy,
//            'order' => $order,
//        );
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/comments/view",
//     *     name="formalibre_admin_ticket_comments_view",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template("FormaLibreSupportBundle:Support:ticketCommentsModalView.html.twig")
//     */
//    public function adminTicketCommentsViewAction(Ticket $ticket)
//    {
//        return array('ticket' => $ticket);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/interventions/view",
//     *     name="formalibre_admin_ticket_interventions_view",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminTicketInterventionsModalView.html.twig")
//     */
//    public function adminTicketInterventionsViewAction(Ticket $ticket)
//    {
//        return array('ticket' => $ticket);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/new/open",
//     *     name="formalibre_admin_ticket_new_open",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     */
//    public function adminNewTicketOpenAction(User $authenticatedUser, Ticket $ticket)
//    {
//        if ($ticket->getLevel() === 0) {
//            $this->supportManager->startTicket($ticket, $authenticatedUser);
//        }
//
//        return new RedirectResponse(
//            $this->router->generate('formalibre_admin_ticket_open', array('ticket' => $ticket->getId()))
//        );
//    }
//
////    /**
////     * @EXT\Route(
////     *     "/admin/ticket/{ticket}/open",
////     *     name="formalibre_admin_ticket_open",
////     *     options={"expose"=true}
////     * )
////     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
////     * @EXT\Template()
////     */
////    public function adminTicketOpenAction(Ticket $ticket)
////    {
////        return array('ticket' => $ticket);
////    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/open/comments",
//     *     name="formalibre_admin_ticket_open_comments",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template()
//     */
//    public function adminTicketOpenCommentsAction(Ticket $ticket)
//    {
//        return array('ticket' => $ticket);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/open/interventions",
//     *     name="formalibre_admin_ticket_open_interventions",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template()
//     */
//    public function adminTicketOpenInterventionsAction(Ticket $ticket)
//    {
//        $totalTime = 0;
//        $interventions = $ticket->getInterventions();
//
//        foreach ($interventions as $intervention) {
//            $duration = $intervention->getDuration();
//
//            if (!is_null($duration)) {
//                $totalTime += $duration;
//            }
//        }
//
//        return array('ticket' => $ticket, 'totalTime' => $totalTime);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/management/info",
//     *     name="formalibre_admin_ticket_management_info",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template()
//     */
//    public function adminTicketManagementInfoAction(
//        User $authenticatedUser,
//        Ticket $ticket
//    ) {
//        $interventions = $ticket->getInterventions();
//        $lastIntervention = null;
//        $nbInterventions = count($interventions);
//        $totalTime = 0;
//
//        if ($nbInterventions > 0) {
//            $lastIntervention = $interventions[$nbInterventions - 1];
//
//            foreach ($interventions as $intervention) {
//                $duration = $intervention->getDuration();
//
//                if (!is_null($duration)) {
//                    $totalTime += $duration;
//                }
//            }
//        }
//
////        $unfinishedInterventions = $this->supportManager->getUnfinishedInterventionByTicket($ticket);
////        $hasOngoingIntervention = false;
////        $ongoingIntervention = null;
////        $otherUnfinishedInterventions = array();
////
////        foreach ($unfinishedInterventions as $unfinishedIntervention) {
////            if ($unfinishedIntervention->getUser() === $authenticatedUser) {
////                $hasOngoingIntervention = true;
////                $ongoingIntervention = $unfinishedIntervention;
////            } else {
////                $otherUnfinishedInterventions[] = $unfinishedIntervention;
////            }
////        }
//        $withCredits = $this->supportManager->getConfigurationCreditOption();
//
//        if ($withCredits) {
//            $datasEvent = new GenericDatasEvent($ticket->getUser());
//            $this->eventDispatcher->dispatch('formalibre_request_nb_remaining_credits', $datasEvent);
//            $response = $datasEvent->getResponse();
//
//            $nbCredits = is_null($response) ? 666 : $response;
//        } else {
//            $nbCredits = 666;
//        }
//        $nbHours = (int) ($totalTime / 60);
//        $nbMinutes = ($nbHours === 0) ? $totalTime : $totalTime % ($nbHours * 60);
//        $totalCredits = (5 * $nbHours) + ceil($nbMinutes / 15);
//
//        return array(
//            'ticket' => $ticket,
//            'currentUser' => $authenticatedUser,
////            'unfinishedInterventions' => $otherUnfinishedInterventions,
////            'hasOngoingIntervention' => $hasOngoingIntervention,
////            'ongoingIntervention' => $ongoingIntervention,
//            'lastIntervention' => $lastIntervention,
//            'nbCredits' => $nbCredits,
//            'totalCredits' => $totalCredits,
//            'availableCredits' => $nbCredits,
//            'totalTime' => $totalTime,
//            'withCredits' => $withCredits,
//        );
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/intervention/start",
//     *     name="formalibre_admin_ticket_intervention_start",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     */
//    public function adminTicketInterventionStartAction(
//        User $authenticatedUser,
//        Ticket $ticket
//    ) {
//        $intervention = new Intervention();
//        $intervention->setTicket($ticket);
//        $intervention->setUser($authenticatedUser);
//        $intervention->setStartDate(new \DateTime());
//        $this->supportManager->persistIntervention($intervention);
//
//        return new JsonResponse(array('id' => $intervention->getId()), 200);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/intervention/{intervention}/stop",
//     *     name="formalibre_admin_ticket_intervention_stop",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     */
//    public function adminTicketInterventionStopAction(Intervention $intervention)
//    {
//        $endDate = new \DateTime();
//        $startDate = $intervention->getStartDate();
//        $startDateTimestamp = $startDate->format('U');
//        $endDateTimestamp = $endDate->format('U');
//        $duration = ceil(($endDateTimestamp - $startDateTimestamp) / 60);
//        $intervention->setEndDate($endDate);
//        $intervention->setDuration($duration);
//        $this->supportManager->persistIntervention($intervention);
//
//        $status = $intervention->getStatus();
//
//        if (!is_null($status)) {
//            $ticket = $intervention->getTicket();
//            $ticket->setStatus($status);
//
//            if ($status->getCode() === 'FA') {
//                $ticket->setLevel(-1);
//            }
//            $this->supportManager->persistTicket($ticket);
//        }
//
//        return new JsonResponse(array('id' => $intervention->getId()), 200);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/type/change/form",
//     *     name="formalibre_admin_ticket_type_change_form",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminTicketTypeChangeModalForm.html.twig")
//     */
//    public function adminTicketTypeChangeFormAction(Ticket $ticket)
//    {
//        $form = $this->formFactory->create(new TicketTypeChangeType($ticket), $ticket);
//
//        return array('form' => $form->createView(), 'ticket' => $ticket);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/type/change",
//     *     name="formalibre_admin_ticket_type_change",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminTicketTypeChangeModalForm.html.twig")
//     */
//    public function adminTicketTypeChangeAction(Ticket $ticket)
//    {
//        $form = $this->formFactory->create(new TicketTypeChangeType($ticket), $ticket);
//        $form->handleRequest($this->request);
//
//        if ($form->isValid()) {
//            $this->supportManager->persistTicket($ticket);
//
//            return new JsonResponse($ticket->getId(), 200);
//        } else {
//            return array('form' => $form->createView(), 'ticket' => $ticket);
//        }
//    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/{ticket}/comment/type/{type}/create/form",
     *     name="formalibre_admin_ticket_comment_create_form",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function adminTicketCommentCreateFormAction(Ticket $ticket, $type)
    {
        $form = $this->formFactory->create(new CommentType(intval($type)), new Comment());

        return [
            'form' => $form->createView(),
            'ticket' => $ticket,
            'type' => $type,
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/{ticket}/comment/type/{type}/create",
     *     name="formalibre_admin_ticket_comment_create",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminTicketCommentCreateForm.html.twig")
     */
    public function adminTicketCommentCreateAction(User $user, Ticket $ticket, $type)
    {
        $comment = new Comment();
        $form = $this->formFactory->create(new CommentType(intval($type)), $comment);
        $form->handleRequest($this->request);

        if ($form->isValid()) {
            $comment->setTicket($ticket);
            $comment->setUser($user);
            $comment->setIsAdmin(true);
            $comment->setType($type);
            $comment->setCreationDate(new \DateTime());
            $this->supportManager->persistComment($comment);
            $this->supportManager->sendTicketMail(
                $user,
                $ticket,
                'new_admin_comment',
                $comment
            );
            $data = [];
            $data['comment'] = [];
            $data['comment']['id'] = $comment->getId();
            $data['comment']['content'] = $comment->getContent();
            $data['comment']['type'] = $comment->getType();
            $data['comment']['creationDate'] = $comment->getCreationDate()->format('d/m/Y H:i');
            $data['user']['id'] = $user->getId();
            $data['user']['firstName'] = $user->getFirstName();
            $data['user']['lastName'] = $user->getLastName();
            $data['user']['picture'] = $user->getPicture();

            return new JsonResponse($data, 201);
        } else {
            return [
                'form' => $form->createView(),
                'ticket' => $ticket,
                'type' => $type,
            ];
        }
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/comment/{comment}/type/{type}/edit/form",
     *     name="formalibre_admin_ticket_comment_edit_form",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminTicketCommentEditModalForm.html.twig")
     */
    public function adminTicketCommentEditFormAction(Comment $comment, $type)
    {
        $form = $this->formFactory->create(new CommentEditType(intval($type)), $comment);

        return [
            'form' => $form->createView(),
            'comment' => $comment,
            'type' => $type,
        ];
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/comment/{comment}/type/{type}/edit",
     *     name="formalibre_admin_ticket_comment_edit",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminTicketCommentEditModalForm.html.twig")
     */
    public function adminTicketCommentEditAction(User $user, Comment $comment, $type)
    {
        $form = $this->formFactory->create(new CommentEditType(intval($type)), $comment);
        $form->handleRequest($this->request);

        if ($form->isValid()) {
            $comment->setEditionDate(new \DateTime());
            $this->supportManager->persistComment($comment);
            $this->supportManager->sendTicketMail(
                $user,
                $comment->getTicket(),
                'new_admin_comment',
                $comment
            );

            return new JsonResponse(
                ['id' => $comment->getId(), 'content' => $comment->getContent(), 'type' => $comment->getType()],
                200
            );
        } else {
            return [
                'form' => $form->createView(),
                'comment' => $comment,
                'type' => $type,
            ];
        }
    }

    /**
     * @EXT\Route(
     *     "/admin/ticket/comment/{comment}/delete",
     *     name="formalibre_admin_ticket_comment_delete",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function adminTicketCommentDeleteAction(Comment $comment)
    {
        $this->supportManager->deleteComment($comment);

        return new JsonResponse('success', 200);
    }

//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/intervention/create/form",
//     *     name="formalibre_admin_ticket_intervention_create_form",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template()
//     */
//    public function adminTicketInterventionCreateFormAction(
//        User $authenticatedUser,
//        Ticket $ticket
//    ) {
//        $intervention = new Intervention();
//        $now = new \DateTime();
//        $intervention->setStartDate($now);
//        $intervention->setEndDate($now);
//        $intervention->setDuration(0);
//        $form = $this->formFactory->create(
//            new InterventionType($authenticatedUser),
//            $intervention
//        );
//
//        return array('form' => $form->createView(), 'ticket' => $ticket);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/{ticket}/intervention/create",
//     *     name="formalibre_admin_ticket_intervention_create",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminTicketInterventionCreateForm.html.twig")
//     */
//    public function adminTicketInterventionCreateAction(
//        User $authenticatedUser,
//        Ticket $ticket
//    ) {
//        $intervention = new Intervention();
//        $intervention->setTicket($ticket);
//        $intervention->setUser($authenticatedUser);
//        $now = new \DateTime();
//        $intervention->setStartDate($now);
//        $form = $this->formFactory->create(
//            new InterventionType($authenticatedUser),
//            $intervention
//        );
//        $form->handleRequest($this->request);
//        $timeType = $form->get('computeTimeMode')->getData();
//        $startDate = $intervention->getStartDate();
//
//        if (!is_null($timeType) && !is_null($startDate)) {
//            $startDateTimestamp = $startDate->format('U');
//
//            if ($timeType === 0) {
//                $endDate = $intervention->getEndDate();
//
//                if (!is_null($endDate)) {
//                    $endDateTimestamp = $endDate->format('U');
//                    $duration = ceil(($endDateTimestamp - $startDateTimestamp) / 60);
//                    $intervention->setDuration($duration);
//                } else {
//                    $form->addError(
//                        new FormError(
//                            $this->translator->trans('end_date_is_required', array(), 'support')
//                        )
//                    );
//                }
//            } elseif ($timeType === 1) {
//                $duration = $intervention->getDuration();
//
//                if (!is_null($duration)) {
//                    $endDateTimestamp = $startDateTimestamp + ($duration * 60);
//                    $endDate = new \DateTime();
//                    $endDate->setTimestamp($endDateTimestamp);
//                    $intervention->setEndDate($endDate);
//                } else {
//                    $form->addError(
//                        new FormError(
//                            $this->translator->trans('duration_is_required', array(), 'support')
//                        )
//                    );
//                }
//            }
//        }
//
//        if ($form->isValid()) {
//            $this->supportManager->persistIntervention($intervention);
//            $status = $intervention->getStatus();
//            $ticket->setStatus($status);
//
//            if ($status->getCode() === 'FA') {
//                $ticket->setLevel(-1);
//            }
//            $this->supportManager->persistTicket($ticket);
//
//            return new RedirectResponse(
//                $this->router->generate(
//                    'formalibre_admin_ticket_open_interventions',
//                    array('ticket' => $ticket->getId())
//                )
//            );
//        } else {
//            return array('form' => $form->createView(), 'ticket' => $ticket);
//        }
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/intervention/{intervention}/edit/form",
//     *     name="formalibre_admin_ticket_intervention_edit_form",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template()
//     */
//    public function adminTicketInterventionEditFormAction(Intervention $intervention)
//    {
//        $form = $this->formFactory->create(
//            new InterventionType($intervention->getUser()),
//            $intervention
//        );
//
//        return array(
//            'form' => $form->createView(),
//            'intervention' => $intervention,
//            'ticket' => $intervention->getTicket(),
//        );
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/intervention/{intervention}/edit",
//     *     name="formalibre_admin_ticket_intervention_edit",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminTicketInterventionEditForm.html.twig")
//     */
//    public function adminTicketInterventionEditAction(Intervention $intervention)
//    {
//        $ticket = $intervention->getTicket();
//        $form = $this->formFactory->create(
//            new InterventionType($intervention->getUser()),
//            $intervention
//        );
//        $form->handleRequest($this->request);
//        $timeType = $form->get('computeTimeMode')->getData();
//        $startDate = $intervention->getStartDate();
//
//        if (!is_null($timeType) && !is_null($startDate)) {
//            $startDateTimestamp = $startDate->format('U');
//
//            if ($timeType === 0) {
//                $endDate = $intervention->getEndDate();
//
//                if (!is_null($endDate)) {
//                    $endDateTimestamp = $endDate->format('U');
//                    $duration = ceil(($endDateTimestamp - $startDateTimestamp) / 60);
//                    $intervention->setDuration($duration);
//                } else {
//                    $form->addError(
//                        new FormError(
//                            $this->translator->trans('end_date_is_required', array(), 'support')
//                        )
//                    );
//                }
//            } elseif ($timeType === 1) {
//                $duration = $intervention->getDuration();
//
//                if (!is_null($duration)) {
//                    $endDateTimestamp = $startDateTimestamp + ($duration * 60);
//                    $endDate = new \DateTime();
//                    $endDate->setTimestamp($endDateTimestamp);
//                    $intervention->setEndDate($endDate);
//                } else {
//                    $form->addError(
//                        new FormError(
//                            $this->translator->trans('duration_is_required', array(), 'support')
//                        )
//                    );
//                }
//            }
//        }
//
//        if ($form->isValid()) {
//            $this->supportManager->persistIntervention($intervention);
//
//            return new RedirectResponse(
//                $this->router->generate(
//                    'formalibre_admin_ticket_open_interventions',
//                    array('ticket' => $ticket->getId())
//                )
//            );
//        } else {
//            return array(
//                'form' => $form->createView(),
//                'intervention' => $intervention,
//                'ticket' => $ticket,
//            );
//        }
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/intervention/{intervention}/delete",
//     *     name="formalibre_admin_ticket_intervention_delete",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     */
//    public function adminTicketInterventionDeleteAction(Intervention $intervention)
//    {
//        $this->supportManager->deleteIntervention($intervention);
//
//        return new JsonResponse('success', 200);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/intervention/{intervention}/status/edit/form",
//     *     name="formalibre_admin_ticket_intervention_status_edit_form",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminInterventionStatusEditModalForm.html.twig")
//     */
//    public function adminTicketInterventionStatusEditFormAction(Intervention $intervention)
//    {
//        $form = $this->formFactory->create(
//            new InterventionStatusType(),
//            $intervention
//        );
//
//        return array('form' => $form->createView(), 'intervention' => $intervention);
//    }
//
//    /**
//     * @EXT\Route(
//     *     "/admin/ticket/intervention/{intervention}/status/edit",
//     *     name="formalibre_admin_ticket_intervention_status_edit",
//     *     options={"expose"=true}
//     * )
//     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
//     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminInterventionStatusEditModalForm.html.twig")
//     */
//    public function adminTicketInterventionStatusEditAction(Intervention $intervention)
//    {
//        $form = $this->formFactory->create(
//            new InterventionStatusType(),
//            $intervention
//        );
//        $form->handleRequest($this->request);
//
//        if ($form->isValid()) {
//            $this->supportManager->persistIntervention($intervention);
//
//            return new JsonResponse($intervention->getId(), 200);
//        } else {
//            return array('form' => $form->createView(), 'intervention' => $intervention);
//        }
//    }

    /**
     * @EXT\Route(
     *     "/admin/support/type/create/form",
     *     name="formalibre_admin_support_type_create_form",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminSupportTypeCreateModalForm.html.twig")
     */
    public function adminSupportTypeCreateFormAction()
    {
        $form = $this->formFactory->create(new TypeType(), new Type());

        return array('form' => $form->createView());
    }

    /**
     * @EXT\Route(
     *     "/admin/support/type/create",
     *     name="formalibre_admin_support_type_create",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminSupportTypeCreateModalForm.html.twig")
     */
    public function adminSupportTypeCreateAction()
    {
        $type = new Type();
        $form = $this->formFactory->create(new TypeType(), $type);
        $form->handleRequest($this->request);

        if ($form->isValid()) {
            $this->supportManager->persistType($type);

            return new JsonResponse(
                ['id' => $type->getId(), 'name' => $type->getName(), 'description' => $type->getDescription()],
                200
            );
        } else {
            return array('form' => $form->createView());
        }
    }

    /**
     * @EXT\Route(
     *     "/admin/support/type/{type}/edit/form",
     *     name="formalibre_admin_support_type_edit_form",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminSupportTypeEditModalForm.html.twig")
     */
    public function adminSupportTypeEditFormAction(Type $type)
    {
        $form = $this->formFactory->create(new TypeType($type->isLocked()), $type);

        return array('form' => $form->createView(), 'type' => $type);
    }

    /**
     * @EXT\Route(
     *     "/admin/support/type/{type}/edit",
     *     name="formalibre_admin_support_type_edit",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminSupportTypeEditModalForm.html.twig")
     */
    public function adminSupportTypeEditAction(Type $type)
    {
        $form = $this->formFactory->create(new TypeType($type->isLocked()), $type);
        $form->handleRequest($this->request);

        if ($form->isValid()) {
            $this->supportManager->persistType($type);

            return new JsonResponse(
                [
                    'id' => $type->getId(),
                    'name' => $type->getName(),
                    'description' => $type->getDescription(),
                    'locked' => $type->isLocked(),
                ],
                200
            );
        } else {
            return array('form' => $form->createView(), 'type' => $type);
        }
    }

    /**
     * @EXT\Route(
     *     "/admin/support/type/{type}/delete",
     *     name="formalibre_admin_support_type_delete",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function adminSupportTypeDeleteAction(Type $type)
    {
        if ($type->isLocked()) {
            throw new AccessDeniedException();
        }
        $this->supportManager->deleteType($type);

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/admin/support/status/create/form",
     *     name="formalibre_admin_support_status_create_form",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminSupportStatusCreateModalForm.html.twig")
     */
    public function adminSupportStatusCreateFormAction()
    {
        $form = $this->formFactory->create(new StatusType(), new Status());

        return array('form' => $form->createView());
    }

    /**
     * @EXT\Route(
     *     "/admin/support/status/create",
     *     name="formalibre_admin_support_status_create",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminSupportStatusCreateModalForm.html.twig")
     */
    public function adminSupportStatusCreateAction()
    {
        $status = new Status();
        $form = $this->formFactory->create(new StatusType(), $status);
        $form->handleRequest($this->request);

        if ($form->isValid()) {
            $lastOrder = $this->supportManager->getOrderOfLastStatus();

            if (is_null($lastOrder['order_max'])) {
                $status->setOrder(1);
            } else {
                $status->setOrder($lastOrder['order_max'] + 1);
            }
            $this->supportManager->persistStatus($status);

            return new JsonResponse(
                [
                    'id' => $status->getId(),
                    'name' => $status->getName(),
                    'description' => $status->getDescription(),
                    'code' => $status->getCode(),
                    'order' => $status->getOrder(),
                    'locked' => $status->isLocked(),
                ],
                200
            );
        } else {
            return array('form' => $form->createView());
        }
    }

    /**
     * @EXT\Route(
     *     "/admin/support/status/{status}/edit/form",
     *     name="formalibre_admin_support_status_edit_form",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminSupportStatusEditModalForm.html.twig")
     */
    public function adminSupportStatusEditFormAction(Status $status)
    {
        $form = $this->formFactory->create(new StatusType($status->isLocked()), $status);

        return array('form' => $form->createView(), 'status' => $status);
    }

    /**
     * @EXT\Route(
     *     "/admin/support/status/{status}/edit",
     *     name="formalibre_admin_support_status_edit",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:adminSupportStatusEditModalForm.html.twig")
     */
    public function adminSupportStatusEditAction(Status $status)
    {
        $form = $this->formFactory->create(new StatusType($status->isLocked()), $status);
        $form->handleRequest($this->request);

        if ($form->isValid()) {
            $this->supportManager->persistStatus($status);

            return new JsonResponse(
                [
                    'id' => $status->getId(),
                    'name' => $status->getName(),
                    'description' => $status->getDescription(),
                    'code' => $status->getCode(),
                    'order' => $status->getOrder(),
                    'locked' => $status->isLocked(),
                ],
                200
            );
        } else {
            return array('form' => $form->createView(), 'status' => $status);
        }
    }

    /**
     * @EXT\Route(
     *     "/admin/support/status/{status}/delete",
     *     name="formalibre_admin_support_status_delete",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function adminSupportStatusDeleteAction(Status $status)
    {
        if ($status->isLocked()) {
            throw new AccessDeniedException();
        }
        $this->supportManager->deleteStatus($status);

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/admin/support/status/{status}/reorder/next/{nextStatusId}",
     *     name="formalibre_admin_support_status_reorder",
     *     options = {"expose"=true}
     * )
     * @EXT\Method("POST")
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function adminSupportStatusReorderAction(Status $status, $nextStatusId)
    {
        $this->supportManager->reorderStatus($status, $nextStatusId);

        return new JsonResponse('success', 200);
    }

    /********************************
     * Plugin configuration methods *
     ********************************/

    /**
     * @EXT\Route(
     *     "/plugin/configure/form",
     *     name="formalibre_support_plugin_configure_form"
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function pluginConfigureFormAction()
    {
        $config = $this->supportManager->getConfiguration();
        $details = $config->getDetails();

        $form = $this->formFactory->create(new PluginConfigurationType($details));

        return array('form' => $form->createView());
    }

    /**
     * @EXT\Route(
     *     "/plugin/configure",
     *     name="formalibre_support_plugin_configure"
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     * @EXT\Template("FormaLibreSupportBundle:AdminSupport:pluginConfigureForm.html.twig")
     */
    public function pluginConfigureAction()
    {
        $config = $this->supportManager->getConfiguration();
        $details = $config->getDetails();
        $parameters = $this->request->request->all();
        $withCredits = !empty($parameters);
        $details['with_credits'] = $withCredits;
        $config->setDetails($details);
        $this->supportManager->persistConfiguration($config);

        return new RedirectResponse(
            $this->router->generate('claro_admin_plugins')
        );
    }
}
