<?php

namespace Claroline\ScormBundle\Library\Export;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Manager\ResourceManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\RouterInterface;

/**
 * RichTextExporter
 *
 * Extracts the list of Resources from an HTML text to add them to the export
 * Replaces claroline URL with SCORM packages URL
 *
 * @DI\Service("claroline.scorm.rich_text_exporter")
 */
class RichTextExporter
{
    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * @var ResourceManager
     */
    private $resourceManager;

    /**
     * @var string
     */
    private $baseUrl;

    /**
     * Class constructor.
     *
     * @param RouterInterface $router
     *
     * @DI\InjectParams({
     *     "router" = @DI\Inject("router"),
     *     "resourceManager" = @Di\Inject("claroline.manager.resource_manager")
     * })
     */
    public function __construct(RouterInterface $router, ResourceManager $resourceManager)
    {
        $this->router = $router;
        $this->resourceManager = $resourceManager;
        $this->baseUrl = $this->router->getContext()->getBaseUrl();
    }

    /**
     * Parses a rich text to extract the resource list.
     *
     * @param string $text
     * @param bool $replaceLinks
     *
     * @return array
     */
    public function parse($text, $replaceLinks = true)
    {
        $resources = [];

        // Find media
        $regex = '#'.$this->baseUrl.'/file/resource/media/([^\'"]+)#';

        preg_match_all($regex, $text, $matches, PREG_SET_ORDER);
        if (count($matches) > 0) {
            foreach ($matches as $match) {
                $node = $this->resourceManager->getNode($match[1]);
                if ($node) {
                    $resource = $this->resourceManager->getResourceFromNode($node);

                    if (empty($resources[$node->getId()])) {
                        $resources[$node->getId()] = $resource;
                    }

                    if ($replaceLinks) {
                        $text = $this->replaceLink($text, $match[0], '/files/media_'.$match[1]);
                    }
                }
            }
        }

        // Find resources
        $regex = '#'.$this->baseUrl.'/resource/open/([^/]+)/([^\'"]+)#';

        preg_match_all($regex, $text, $matches, PREG_SET_ORDER);
        if (count($matches) > 0) {
            foreach ($matches as $match) {
                $node = $this->resourceManager->getNode($match[2]);
                if ($node) {
                    $resource = $this->resourceManager->getResourceFromNode($node);

                    if (empty($resources[$node->getId()])) {
                        $resources[$node->getId()] = $resource;
                    }

                    if ($replaceLinks) {
                        $text = $this->replaceLink($text, $match[0], '/scos/resource_'.$match[2].'.html');
                    }
                }
            }
        }

        return [
            'text' => $text,
            'resources' => $resources
        ];
    }

    private function replaceMediaLink()
    {

    }

    private function replaceResourceLink()
    {

    }

    private function replaceLink($txt, $fullMatch, $newLink)
    {
        //videos <source type="video/webm" src=...media...></source>
        //files <a href=...open...> - name - </a>
        //imgs <img style='max-width: 100%;' src='{$url}' alt='{$node->getName()}'>
        $matchReplaced = [];
        $fullMatch = preg_quote($fullMatch);

        preg_match(
            "#(<source|<a)(.*){$fullMatch}(.*)(</a>|</source>)#",
            $txt,
            $matchReplaced
        );

        if (count($matchReplaced) > 0) {
            $txt = str_replace($matchReplaced[0], $newLink, $txt);
        }

        return $txt;
    }
}
