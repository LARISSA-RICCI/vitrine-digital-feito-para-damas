"""Verificações estáticas da versão original publicada no GitHub."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.images = []
        self.title = []
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'img':
            self.images.append(attrs.get('src', ''))
        if tag == 'title':
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)


class TestVitrineDigital(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / 'index.html').read_text(encoding='utf-8')
        cls.doc = SiteParser()
        cls.doc.feed(cls.html)

    def test_titulo_do_site(self):
        self.assertIn('Feito para Damas', ''.join(self.doc.title))

    def test_secoes_de_navegacao(self):
        self.assertTrue({'inicio', 'servicos', 'localizacao'} <= self.doc.ids)

    def test_links_de_contato(self):
        self.assertTrue(any(link.startswith('https://wa.me/5517992849596') for link in self.doc.links))
        self.assertIn('https://www.instagram.com/feitopara.damas/', self.doc.links)

    def test_imagens_incorporadas(self):
        self.assertTrue(any(src.startswith('data:image/') for src in self.doc.images))

    def test_informacoes_de_atendimento(self):
        self.assertIn('Atendimento express', self.html)
        self.assertIn('Pacotes de massagem', self.html)
        self.assertIn('Bebedouro', self.html)


if __name__ == '__main__':
    unittest.main()
