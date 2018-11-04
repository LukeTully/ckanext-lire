ckan.module('lire', function ($) {
    return {
        initialize: function () {


            function getCurrentSelectionFromTarget(source, target) {
                var selectedIndexVal = source[0].item(source[0].selectedIndex).value;
                var targetOptions = target[0].options;
                var selectedItem = null;

                // Find and remove the item in the target list if it exists
                for (var i = 0; i < targetOptions.length; i++) {

                    if (selectedIndexVal == targetOptions[i].value) {
                        selectedItem = targetOptions.item(i);
                        targetOptions.remove(i);

                        // Return the found item
                        return {
                            node: selectedItem,
                            index: i
                        }
                    }
                }
                return false;
            }

            function replaceOption(optionNode, index, dropdown) {

                var optionList = dropdown[0].options;
                var optionEl = optionNode;

                debugger;

                // Take the previously removed node and insert it back into the options list before the index
                optionList.add(optionNode, index)
            }

            var subjectDropdownSelector = 'select[name=subject]';
            var objectDropdownSelector = 'select[name=object]';


            // TODO: Make these reference dom nodes instead of jQuery objects
            var subjectDropdown = $(subjectDropdownSelector);
            var objectDropdown = $(objectDropdownSelector);

            var optionCache = {
                'subject': {
                    index: null,
                    node: null
                },
                'object': {
                    index: null,
                    node: null
                }
            }; // Store options that are removed

            var subjectOptions = subjectDropdown[0].options;
            var objectOptions = objectDropdown[0].options;

            // Store the current selection from the target dropdown list for later
            optionCache.object = getCurrentSelectionFromTarget(subjectDropdown, objectDropdown);

            console.log($(optionCache.object.node).val());


            // Remove from the object list whichever is selected in the subject list
            subjectDropdown.on('change', function (e) {
                // Check if there is an option Node that has previously been removed
                if (optionCache.object.index >= 0) {
                    replaceOption(optionCache.object.node, optionCache.object.index, objectDropdown);

                    // Clear the cache
                    optionCache.object.index = null;
                    optionCache.object.node = null;
                }
                optionCache.object = getCurrentSelectionFromTarget(subjectDropdown, objectDropdown);
                console.log($(optionCache.object.node).val())
            });


        }
    };
});