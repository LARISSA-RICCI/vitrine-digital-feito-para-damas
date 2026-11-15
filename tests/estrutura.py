import base64
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
class Elements(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.tags=[]; self.feed(html)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

class StructureTests(unittest.TestCase):
    def setUp(self):
        self.tags=Elements((ROOT/'index.html').read_text()).tags
    def test_local_resources_exist(self):
        for tag, attrs in self.tags:
            key='src' if tag in ('script','img') else 'href' if tag=='link' else None
            value=attrs.get(key,'')
            if value and not value.startswith(('data:','https:','http:','#')):
                self.assertTrue((ROOT/value).is_file(),value)
    def test_ids_are_unique(self):
        ids=[a['id'] for _,a in self.tags if 'id' in a]
        self.assertEqual(len(ids),len(set(ids)))
    def test_images_have_alternative_text(self):
        for tag,a in self.tags:
            if tag=='img': self.assertIn('alt',a)
    def test_embedded_images_are_valid_base64(self):
        for _,a in self.tags:
            for value in a.values():
                if value and value.startswith('data:image/') and ';base64,' in value:
                    self.assertTrue(base64.b64decode(value.split(',',1)[1],validate=True))
    def test_new_tabs_are_protected(self):
        for tag,a in self.tags:
            if tag=='a' and a.get('target')=='_blank': self.assertIn('noopener',a.get('rel',''))

if __name__=='__main__': unittest.main()
