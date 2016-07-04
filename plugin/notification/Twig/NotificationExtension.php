<?php

namespace Icap\NotificationBundle\Twig;

class NotificationExtension extends \Twig_Extension
{
    protected $translator;

    public function __construct($translator)
    {
        $this->translator = $translator;
    }

    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('smartDate', [$this, 'getSmartDate']),
            new \Twig_SimpleFilter('notificationMessage', [$this, 'getNotificationMessage']),
            new \Twig_SimpleFilter('rssMessage', [$this, 'getRssMessage']),
        ];
    }

    public function getNotificationMessage($notification, $user = null, $resource = null, $systemName = '')
    {
        if (!empty($resource)) {
            $actionMessage = $this->translator->trans(
                $notification->getActionKey(),
                ['%resourceName%' => $resource['name']],
                'notification'
            );
        } else {
            $actionMessage = $this->translator->trans($notification->getActionKey(), [], 'notification');
        }

        if (!empty($user)) {
            $message = '<strong>'.$user['firstName'].' '.$user['lastName'].'</strong> ';
        } else {
            $message = '<strong>'.$systemName.'</strong> ';
        }

        $message .= $actionMessage;

        return $message;
    }

    public function getSmartDate($rawDate)
    {
        $timestamp = $rawDate->getTimestamp();
        $months = explode(', ', $this->translator->trans('months', [], 'notification'));
        $days = explode(', ', $this->translator->trans('days', [], 'notification'));

        if ($timestamp > strtotime('-2 minutes')) {
            $smartDate = $this->translator->trans('few_seconds_ago', [], 'notification');
        } elseif ($timestamp > strtotime('-59 minutes')) {
            $minutes = floor((strtotime('now') - $timestamp) / 60);
            $smartDate = $this->translator->transChoice(
                'minutes_ago',
                $minutes,
                ['%count%' => $minutes],
                'notification'
            );
        } elseif ($timestamp > strtotime('today')) {
            $hours = floor((strtotime('now') - $timestamp) / (60 * 60));
            $smartDate = $this->translator->transChoice(
                'hours_ago',
                $hours,
                ['%count%' => $hours],
                'notification'
            );
        } elseif ($timestamp > strtotime('yesterday')) {
            $smartDate = $this->translator->trans('yesterday', [], 'notification').
                $rawDate->format($this->translator->trans('hour_format', [], 'notification'));
        } elseif ($timestamp > strtotime('this week')) {
            $smartDate = $days[$rawDate->format('N') - 1].
                $rawDate->format($this->translator->trans('hour_format', [], 'notification'));
        } elseif ($timestamp > strtotime('first day of January', time())) {
            $month = $months[$rawDate->format('n') - 1];
            $day = $rawDate->format('j');
            $smartDate = $this->translator->trans(
                    'day_format',
                    [
                        '%month%' => $month,
                        '%day%' => $day,
                    ],
                    'notification'
                ).$rawDate->format($this->translator->trans('hour_format', [], 'notification'));
        } else {
            $month = $months[$rawDate->format('n') - 1];
            $day = $rawDate->format('j');
            $smartDate = $this->translator->trans(
                    'day_format',
                    [
                        '%month%' => $month,
                        '%day%' => $day,
                    ],
                    'notification'
                ).' '.$rawDate->format('Y').' '.
                $rawDate->format($this->translator->trans('hour_format', [], 'notification'));
        }

        return $smartDate;
    }

    public function getRssMessage($message)
    {
        $message = preg_replace("/<span[^>]*?>.*?<\/span>/si", '', $message);

        return html_entity_decode($message, ENT_QUOTES);
    }

    public function getName()
    {
        return 'notification_extension';
    }
}
