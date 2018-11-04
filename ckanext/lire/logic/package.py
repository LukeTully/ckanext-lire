import ckan.plugins.toolkit as toolkit
import ckan.lib.helpers as helpers
from ckan import model
import ckan.logic as logic


# Return a list of datasets that the current used can edit
def get_editable_packages():
    auth_list = []
    # Get a list of all packages
    # Todo: There has to be a more succinct way to get a list of packages, as dicts, that the current user has permission to edit
    all_datasets = toolkit.get_action('package_list')({}, {})
    if all_datasets:
        for dataset in all_datasets:
            # Check for update permission authorization
            if helpers.check_access('package_update',{'id': dataset}):
                auth_list.append(toolkit.get_action('package_show')({}, {
                    'id': dataset
                }))

    return auth_list


# Get a list of potential relationships
def get_relationship_types():
    types = [
        'depends_on',
        'dependency_of',
        'derives_from',
        'has_derivation',
        'child_of',
        'parent_of']
    return types


# Returns a list of all packages that have relationships
@logic.side_effect_free
def get_dataset_relationships(context, data_dict, pkg_list=None):
    pkg_ledger = []  # De-duplicate our package list

    if not pkg_list:
        pkg_list = get_editable_packages()

    # Store packages that do have relationships
    pkg_rels = []
    for pkg in pkg_list:
        rels = toolkit.get_action('package_relationships_list')({}, {
            'id': pkg['id']
        })
        if rels:
            pkg_rels.append({
                'title': pkg['title'],
                'name': pkg['name'],
                'relationships': rels
            })

    return pkg_rels
