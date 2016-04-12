OVERRIDEN REPOSITORY METHODS
============================

- AdministrationToolRepository::findAll()
- AdministrationToolRepository::findByRoles()

- ResourceTypeRepository::findPluginResourceTypes()
- ResourceTypeRepository::findAll()

- ResourceNodeRepository (for resourceQueryBuilder)

FORM OVERRIDEN
==============

- WidgetInstanceType -> widget

QUESTION
========

- Should the CoreBundle be considered as a plugin to avoid queries like this ?

left join xxx.plugin p
where p.isEnabled = true
or xxx.plugin is null
