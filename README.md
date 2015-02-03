# Inwicast - Claroline Plugin Bundle

Plugin for Inwicast Mediacenter integration in [Claroline Connect](https://github.com/claroline/Claroline/) educational platform.

## Project setup
### Requirements
- [Claroline Connect requirements](https://github.com/claroline/Claroline/blob/master/README.md#requirements)
- PHP extensions:
    - xmlrpc
    - gmp
- Libraries:
    - libgmp-dev (to make gmp extension work)

### Installation
When Claroline Connect is installed, run:

    composer update inwicast/claroline-plugin-bundle --prefer-source

### Configuration
As admin on Claroline Connect, go to Administration > Platform packages (on the left tab) > Plugin packages, and click on the gears icon next to inwicast/claroline-plugin-bundle.
Then type the URL to Mediacenter and click validate. A message confirms how the operation has been done.

### Widget
Now "Inwicast video" must appear in the add-widget modal view. To choose a video to display, you have to configure the widget:
- Click on the gears next to the created widget
- Select "Edit"
- Log into the Mediacenter (this will be asked only once)
- Select the video (a search tool is available)

### Resource
You can import your Mediacenter videos into Claroline via the Resources manager. 
In the "Create" menu, select Inwicast videos, login to the Mediacenter (if not done before), and all your Mediacenter videos will be imported.
You can now manage it as any resource, and import it with the rich text editor.

## Version
0.9.0

## Licence
(c) Inwicast, All Rights Reserved
