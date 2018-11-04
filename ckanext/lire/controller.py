try:
    import cStringIO as StringIO
except ImportError:
    import StringIO

import ckan.plugins.toolkit as toolkit
from ckan.lib.base import BaseController, request
from ckanext.lire.logic.package import get_dataset_relationships
from ckanext.lire.logic.package import get_editable_packages
from ckanext.lire.logic.package import get_relationship_types

c = toolkit.c
render = toolkit.render


class LIREController(BaseController):
    cache = {}

    errors = {}

    # index function for display form to load datasets for managing their relations
    def index(self):

        return render('lire/index.html', {
            'auth_datasets': get_editable_packages(),
            'relationship_types': get_relationship_types(),
            'relationships': get_dataset_relationships(None, None),
            'errors': self.errors
        })

    # main extension function
    def manager(self):
        # Todo: Validation (Can't have a relationship with self)
        # Todo: Refactor this function to accurately describe what it does
        types = get_relationship_types()
        final_type = types[int(request.params['relationshipType'])]

        subject_id = request.params['subject']
        object_id = request.params['object']
        comment_body = request.params['comment']

        if self._verify_relationship(subject_id, object_id):
            # Create a new relationship
            result = toolkit.get_action('package_relationship_create')(
                data_dict={
                    'subject': subject_id,
                    'object': object_id,
                    'type': final_type,
                    'comment': comment_body
                })
            if result:
                return toolkit.redirect_to('/lire')
        else:
            self.errors['relationship'] = "Can't define self-referential relationships"
            return self.index()

    def _verify_relationship(self, subject, object):

        # Reject self-referential relationships
        if subject == object:
            return False

        return True
