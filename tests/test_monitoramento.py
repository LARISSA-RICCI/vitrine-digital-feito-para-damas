import unittest
from unittest.mock import MagicMock, patch
from urllib.error import URLError

from scripts.monitoramento import check_resource


class MonitoringTests(unittest.TestCase):
    def response(self, status, body):
        response = MagicMock()
        response.__enter__.return_value = response
        response.status = status
        response.read.return_value = body
        return response

    def test_http_200_com_conteudo_esperado_esta_up(self):
        with patch('scripts.monitoramento.urlopen', return_value=self.response(200, b'id="perfumaria"')):
            result = check_resource('/', 'id="perfumaria"')
        self.assertEqual(result['status'], 'UP')
        self.assertEqual(result['attempts'], 1)

    @patch('scripts.monitoramento.time.sleep')
    def test_pagina_de_login_com_http_200_nao_e_up(self, sleep):
        with patch('scripts.monitoramento.urlopen', return_value=self.response(200, b'Sign in')) as request:
            result = check_resource('/', 'id="perfumaria"')
        self.assertEqual(result['status'], 'DOWN')
        self.assertEqual(request.call_count, 3)

    @patch('scripts.monitoramento.time.sleep')
    def test_erro_de_rede_apos_tres_tentativas_esta_down(self, sleep):
        with patch('scripts.monitoramento.urlopen', side_effect=URLError('indisponivel')):
            result = check_resource('/', 'id="perfumaria"')
        self.assertEqual(result['status'], 'DOWN')
        self.assertEqual(result['attempts'], 3)

    @patch('scripts.monitoramento.time.sleep')
    def test_recuperacao_na_segunda_tentativa_esta_up(self, sleep):
        with patch('scripts.monitoramento.urlopen', side_effect=[URLError('temporario'), self.response(200, b':root')]):
            result = check_resource('/css/style.css', ':root')
        self.assertEqual(result['status'], 'UP')
        self.assertEqual(result['attempts'], 2)


if __name__ == '__main__':
    unittest.main()
