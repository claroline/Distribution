<?php

namespace Claroline\ScormBundle\Library\Export;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
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
     * Class constructor.
     *
     * @param RouterInterface $router
     *
     * @DI\InjectParams({
     *     "router" = @DI\Inject("router")
     * })
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * Parses a rich text to extract the resource list.
     *
     * @param string $text
     * @param bool $replaceLinks
     *
     * @return AbstractResource[]
     */
    public function parse($text, $replaceLinks = true)
    {
        $baseUrl = $this->router->getContext()->getBaseUrl();

        //first regex
        $regex = '#'.$baseUrl.'/file/resource/media/([^\'"]+)#';

        preg_match_all($regex, $text, $matches, PREG_SET_ORDER);

        if (count($matches) > 0) {
            foreach ($matches as $match) {
                if (!$this->getItemFromUid($match[1], $_data)) {
                    $this->createDataFolder($_data);
                    $node = $this->resourceManager->getNode($match[1]);

                    if ($node && $node->getResourceType()->getName() === 'file') {
                        $el = $this->getImporterByName('resource_manager')->getResourceElement(
                            $node,
                            $node->getWorkspace(),
                            $_files,
                            $_data,
                            true
                        );
                        $el['item']['parent'] = 'data_folder';
                        $el['item']['roles'] = [['role' => [
                            'name' => 'ROLE_USER',
                            'rights' => $this->maskManager->decodeMask(7, $this->resourceManager->getResourceTypeByName('file')),
                        ]]];
                        $_data['data']['items'][] = $el;
                    }
                }

                $text = $this->replaceLink($text, $match[0], $match[1], $_data);
            }
        }

        //second regex
        $regex = '#'.$baseUrl.'/resource/open/([^/]+)/([^\'"]+)#';
        preg_match_all($regex, $text, $matches, PREG_SET_ORDER);

        if (count($matches) > 0) {
            foreach ($matches as $match) {
                $text = $this->replaceLink($text, $match[0], $match[2]);
            }
        }
    }
}
