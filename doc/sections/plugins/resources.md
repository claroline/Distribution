[[Documentation index]][1]

#Resource plugin

## Plugin configuration file
Your plugin must define its properties and the list of its resources in the
*Resources/config/config.yml file*.

This file will be parsed by the plugin installator to install your plugin and
create all your declared resources types in the database.

```yml
plugin:
    # Properties of resources managed by your plugin
    # You can define as many resource types as you want in this file.
    resources:
        # "class" is the entity of your resource. This may be the entity of a existing
        # resource of the platform. This entity defines how the resource is stocked.
        # It may be usefull is your resource is a zip file with a particular structure.
        # In this case you can extend *Claroline\CoreBundle\Entity\Resource\File*.
      - class: Claroline\ExampleBundle\Entity\Example
        # Your resource type name
        name: claroline_example
        # Do you want your resource to be exported as a part of a workspace model ?
        # Note: the default value of this parameter is "false"
        is_exportable: false
        # Icon for your resource.
        # They must be stored in the Resource/public/images/icon
        icon: res_text.png
        # Which are the actions we can fire from the resource manager.
        # Note that the resource manager will set some defaults actions
        #  (parameters, delete and download).
        # The name field allow you to chose an existing action ('open', 'delete', 'edit') or
        # to create a new one if the Claroline core couldn't find your action name.
        # The menu_name is optional. This will append a menu for your resource name with the menu_name you picked.
        # The is_form parameter is also optional. If it's set to true, you'll be able to generate a form popup. Otherwise, you'll be redirected to a new page when you click on the menu action.
        # You can translate them in with a translation file from the resource domain.
        # You will be able to use these actions as a parameter for the isGranted() method.
        actions:
            - name: actionname
            - menu_name: new_menu (this line is optional)
              is_form: true (optional)
```

**/!\ it's a good practice to prefix your resources and widgets names to avoid
possible conflicts with other plugins **

## Doctrine entities

Define your Doctrine entities in the Entity folder.

If your entity is a resource that must be recognized by the platform and
manageable in the resource manager then you must extend the
*Claroline\CoreBundle\Entity\Resource\AbstractResource* class.

```yml
/**
 * @ORM\Entity
 * @ORM\Table(name="claro_text")
 */
class Text extends AbstractResource
{
    /**
    * @ORM\Column(type="string")
    */
    private $text;

    public function setText($text)
    {
        $this->text = $text;
    }

    public function getText()
    {
        return $this->text;
    }
}
```

Listener
--------

The resource manager will trigger some events (Open, Delete...) on your
resources. Your plugin must implements a listener to catch events that concern
its resources and must apply appropriate action.

### Listener definition file ###

The definition of your listener must be placed in the
*Resources/config/services/listeners.yml* file.
Here is the list of events fired by the resource manager
(lower case is forced here):

* create_*resourcetypename* => CreateResourceEvent
* delete_*resourcetypename* => DeleteResourceEvent
* download_*resourcetypename* => DownloadResourceEvent
* copy_*resourcetypename* => CopyResourceEvent
* open_*resourcetypename* => OpenResourceEvent
* *customaction*_*resourcetypename* => CustomActionResourceEvent

Where *resourcetypename* is the name of your resource (e.g. "text") and
*customaction* is a custom action you defined earlier in the plugin
configuration (e.g. "open").

**Note**: If your plugin don't catch the download event, a placeholder will be
set in the archive.

### Listener implementation class

Define your listener class in the *Listener* folder. The following code comes
from the FileListener. We are going to analyze it.

**Delete**

```php
/**
 * @Observe("resource.file.delete")
 *
 * @param DeleteResourceEvent $event
 */
public function onDelete(DeleteResourceEvent $event)
{
    $pathName = $this->container->getParameter('claroline.param.files_directory')
        . DIRECTORY_SEPARATOR
        . $event->getResource()->getHashName();
    if (file_exists($pathName)) {
        unlink($pathName);
    }
    $event->stopPropagation();
}
```

As you can observe, we can get the removed file from the event and perform some
operations. In this case we need to remove a file in the /file folder.
In most case you won't have to do anything.

**Copy**

```php
/**
 * @Observe("copy_file")
 *
 * @param CopyResourceEvent $event
 */
public function onCopy(CopyResourceEvent $event)
{
    $newFile = $this->copy($event->getResource());
    $event->setCopy($newFile);
    $event->stopPropagation();
}
```

In this case, we copy the file from the copied File entity in the /file folder.

**Download**

```php
/**
 * @Observe("download_file")
 *
 * @param DownloadResourceEvent $event
 */
public function onDownload(DownloadResourceEvent $event)
{
    $file = $event->getResource();
    $hash = $file->getHashName();
    $event->setItem(
        $this->container->getParameter('claroline.param.files_directory') . DIRECTORY_SEPARATOR . $hash
    );
    $event->stopPropagation();
}
```

The DownloadResourceEvent accepts a file path in its setItem() method.
This will be the file downloaded by the user.

**Open**

The following code comes from the TextListener class:

```php
/**
 * @Observe("open_text")
 *
 * @param OpenResourceEvent $event
 */
public function onOpen(OpenResourceEvent $event)
{
    $text = $event->getResource();
    $collection = new ResourceCollection(array($text->getResourceNode()));
    $isGranted = $this->container->get('security.authorization_checker')->isGranted('WRITE', $collection);
    $revisionRepo = $this->container->get('doctrine.orm.entity_manager')
        ->getRepository('ClarolineCoreBundle:Resource\Revision');
    $content = $this->container->get('templating')->render(
        'ClarolineCoreBundle:Text:index.html.twig',
        array(
            'text' => $revisionRepo->getLastRevision($text)->getContent(),
            '_resource' => $text,
            'isEditGranted' => $isGranted
        )
    );
    $response = new Response($content);
    $event->setResponse($response);
    $event->stopPropagation();
}
```

As you can see, the OpenResourceEvent requires a response.

**Custom actions**

The following code comes from the ActivityListener class:

```php
/**
 * @Observe("compose_activity")
 */
public function onCompose(CustomActionResourceEvent $event)
{
    $activity = $event->getResource();
    ...

    $content = $this->container->get('templating')->render(
        'ClarolineCoreBundle:Activity:index.html.twig',
        array(
            'resourceTypes' => $resourceTypes,
            'resourceActivities' => $resourceActivities,
            '_resource' => $activity
        )
    );

    $response = new Response($content);
    $event->setResponse($response);
    $event->stopPropagation();
}
```

The event expects to receive a response back. You can notice the event name.

- "compose" is an additional action name (see the config example).
- "activity" is the resource type name.

If the *is_form* parameter is set to **true**, you have to return a modal form as shown below (example from the UrlBundle) :

```html
<div class="modal-dialog">
    <form role="form" novalidate="novalidate"
        action="{{ path('hevinci_url_change', {'node': node}) }}" enctype="multipart/form-data"
        method="post" class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h4 class="modal-title">{{ 'change_url_menu'|trans({}, 'resource') }}</h4>
        </div>
        <div class="modal-body">
            {{ form_errors(form) }}
            {{ form_widget(form) }}
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">{{ 'cancel'|trans({}, 'platform') }}</button>
            <input type="submit" class="btn btn-primary" value="{{ 'ok'|trans({}, 'platform') }}">
        </div>
    </form>
</div>
```

To validate your form, you must return a JsonResponse.

```php
public function changeUrlAction(ResourceNode $node)
{
    $em = $this->getDoctrine()->getManager();
    $url = $em->getRepository('HeVinciUrlBundle:Url')
        ->findOneBy(array('resourceNode' => $node->getId()));

    $form = $this->formFactory->create(new UrlChangeType(), $url);
    $form->handleRequest($this->request);

    if ($form->isValid()){
        $em->flush();

        return new JsonResponse();
    }

    return array('form' => $form->createView(), 'node' => $node->getId());
}
```

### Keeping the context ###

What we call the context is the place were the resource is opened. This place
will define wich layout should be used.
You can find wich template to use with this code (it's not automatic yet in subject to changes)

```html+jinja
{% set layout = "ClarolineCoreBundle:workspace:layout.html.twig" %}

{% if isDesktop() %}
    {% set layout = "ClarolineCoreBundle:desktop:layout.html.twig" %}
{% endif %}

{% extends layout %}
```

As you already know, AbstractResource has a mandatory relation to the
ResourceNode table. The ResourceNode
table has a mandatory relation to the Workspace table.
The Workspace indicate the context in wich your resource was placed.
A resource is usually opened through the resource manager. The resource manager
will append the resource breadcrumbs to the url (_breadcrumbs[]=123&...) to keep
track of wich path the user chosed to open the resource. If a breadcrumbs is
present, the Claroline core will automaticallyfind in wich workspace the
resource was open (it's the root of the breadcrumbs).

A fallback is needed if there is no breadcrumbs. That's why a _resource
parameter is required for the template to work in these cases wich you also can
see in the previous snippet.

```php
render('xxx', array('_resource' => $resource))
```

## Translations

* resource.xx.yml

We use lower case for every translation keys.
You must translate your resource type name in this file.

```yml
translation_key: "clef de traduction"
text: "Texte"
```

### Redirection ###

If you want to navigate inside a resource and keep the context (the breadcrumbs)
and allow the navigation inside an activity. You must use the twig method _path
for your url generation. This method is a copy of the twig path method wich
copy the breadcrumbs.


### Editing a resource

There is no predefined event for this action.
If you want to implement it, you must create some custom actions
(see plugin configuration file).

### Creation

Rights are defined for the first time at the workspace root at the workspace
creation.
When a resource is created, the parent rights are copied to the children rights
(same when a resource is moved or copied).

[[Documentation index]][1]

[1]: ../../index.md
