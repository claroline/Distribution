<?php

namespace Innova\CollecticielBundle\DataFixtures;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\Persistence\ObjectManager;
use Innova\CollecticielBundle\Entity\ReturnReceiptType;

class DefaultData extends AbstractFixture
{
    public function load(ObjectManager $manager)
    {
        /* RETURN RECEIPT TYPE ARRAY */
        /*
         * array format:
         *   - name
         */
        $returnreceipttypesArray = [
                ['NO RETURN RECEIPT'],
                ['DOUBLOON'],
                ['DOCUMENT RECEIVED'],
                ['DOCUMENT UNREADABLE'],
                ['INCOMPLETE DOCUMENT'],
                ['ERROR DOCUMENT'],
        ];

        /* TRAITEMENT */
        foreach ($returnreceipttypesArray as $returnreceipttype) {
            $returnReceiptTypeAdd = new ReturnReceiptType();
            $returnReceiptTypeAdd->setTypeName($returnreceipttype[0]);
            $manager->persist($returnReceiptTypeAdd);
        }

        $manager->flush();
    }
}
