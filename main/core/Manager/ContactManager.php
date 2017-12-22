<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\CoreBundle\Entity\Contact\Contact;
use Claroline\CoreBundle\Entity\Contact\Options;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.contact_manager")
 */
class ContactManager
{
    private $om;

    private $categoryRepo;
    private $contactRepo;
    private $optionsRepo;

    /**
     * ContactManager constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;

        $this->categoryRepo = $om->getRepository('ClarolineCoreBundle:Contact\Category');
        $this->contactRepo = $om->getRepository('ClarolineCoreBundle:Contact\Contact');
        $this->optionsRepo = $om->getRepository('ClarolineCoreBundle:Contact\Options');
    }

    /**
     * Fetches user options.
     *
     * @param User $user
     *
     * @return Options
     */
    public function getUserOptions(User $user)
    {
        $options = $this->optionsRepo->findOneBy(['user' => $user]);

        if (is_null($options)) {
            $options = new Options();
            $options->setUser($user);
            $defaultValues = [
                'show_all_my_contacts' => true,
                'show_all_visible_users' => true,
                'show_username' => true,
                'show_mail' => false,
                'show_phone' => false,
                'show_picture' => true,
            ];
            $options->setOptions($defaultValues);
            $this->om->persist($options);
            $this->om->flush();
        }

        return $options;
    }

    /**
     * Creates contacts from a list of user.
     *
     * @param User   $currentUser
     * @param User[] $users
     *
     * @return Contact[]
     */
    public function createContacts(User $currentUser, array $users)
    {
        $this->om->startFlushSuite();
        $createdContacts = [];

        foreach ($users as $user) {
            $contact = $this->contactRepo->findOneBy(['user' => $currentUser, 'contact' => $user]);

            if (is_null($contact)) {
                $contact = new Contact();
                $contact->setUser($currentUser);
                $contact->setContact($user);
                $this->om->persist($contact);
                $createdContacts[] = $contact;
            }
        }
        $this->om->endFlushSuite();

        return $createdContacts;
    }

    /**
     * Removes a contact.
     *
     * @param Contact $contact
     */
    public function deleteContact(Contact $contact)
    {
        $this->om->remove($contact);
        $this->om->flush();
    }
}
