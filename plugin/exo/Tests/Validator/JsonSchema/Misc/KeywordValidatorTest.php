<?php

namespace UJM\ExoBundle\Tests\Validator\JsonSchema\Misc;

use UJM\ExoBundle\Library\Testing\Json\JsonSchemaTestCase;
use UJM\ExoBundle\Validator\JsonSchema\Misc\KeywordValidator;

class KeywordValidatorTest extends JsonSchemaTestCase
{
    /**
     * @var KeywordValidator
     */
    private $validator = null;

    protected function setUp()
    {
        parent::setUp();

        $this->validator = $this->injectJsonSchemaMock(new KeywordValidator());
    }

    /**
     * The validator MUST NOT return errors if the keywords collection is valid.
     */
    public function testValidCollectionThrowsNoError()
    {
        $collectionData = $this->loadTestData('misc/keyword/valid/collection.json');

        $this->assertEquals(0, count($this->validator->validateCollection($collectionData)));
    }

    /**
     * The validator MUST return an error if there are duplicates keywords in the collection.
     * Two keywords are duplicates if they share the same `text` and `caseSensitive`.
     */
    public function testCollectionWithDuplicatesThrowsError()
    {
        $collectionData = $this->loadTestData('misc/keyword/invalid/collection-with-duplicates.json');

        $errors = $this->validator->validateCollection($collectionData);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '/1',
            'message' => "there is already a keyword with text: 'lorem' and caseSensitive: 'false'",
        ], $errors));
    }

    /**
     * The validator MUST validate scores if the option `validateScore` is set.
     * The validator MUST return errors if there is no keyword with a positive score in the collection.
     */
    public function testCollectionScoresAreValidatedIfValidateScoreOption()
    {
        $collectionData = $this->loadTestData('misc/keyword/invalid/collection-with-no-positive-score.json');

        // Test with option not set (expects no error)
        $this->assertEquals(0, count($this->validator->validateCollection($collectionData)));

        // Test with option set to `true` (expects errors)
        $this->assertGreaterThan(0, count($this->validator->validateCollection($collectionData, ['validateScore' => true])));
    }

    /**
     * The validator MUST validate each keyword against its JSON schema if the option `validateSchema` is set.
     */
    public function testCollectionSchemasAreValidatedIfValidateSchemaOption()
    {
        $collectionData = $this->loadTestData('misc/keyword/invalid/collection-with-invalid-keyword.json');

        // We get the real validator instance because we have mocked the JsonSchema validator
        $validator = $this->client->getContainer()->get('ujm_exo.validator.keyword');

        // Test with option not set (expects no schema validation error)
        $this->assertEquals(0, count($validator->validateCollection($collectionData)));

        // Test with option set to `true` (expects schema validation errors)
        $this->assertGreaterThan(0, count($validator->validateCollection($collectionData, ['validateSchema' => true])));
    }

    /**
     * The validator MUST return an error if there is no keyword with a positive score in the collection.
     */
    public function testCollectionWithNoPositiveScoreThrowsError()
    {
        $collectionData = $this->loadTestData('misc/keyword/invalid/collection-with-no-positive-score.json');

        $errors = $this->validator->validateCollection($collectionData, ['validateScore' => true]);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '',
            'message' => 'there is no keyword with a positive score',
        ], $errors));
    }
}
