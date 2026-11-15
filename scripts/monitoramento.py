"""Verifica a disponibilidade HTTP e o conteúdo essencial do site publicado."""
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import time
from urllib.error import URLError
from urllib.request import Request, urlopen

BASE_URL = 'https://feito-para-damas-beleza.larissa2013ricci.chatgpt.site'
RESOURCES = [
    ('/', 'id="perfumaria"'),
    ('/css/style.css', ':root'),
    ('/js/main.js', 'function waFor'),
]


def check_resource(path, marker):
    url = BASE_URL + path
    started = time.monotonic()
    detail = ''
    http_status = None
    for attempt in range(1, 4):
        try:
            request = Request(url, headers={'User-Agent': 'VitrineDigital-AvailabilityMonitor/1.0'})
            with urlopen(request, timeout=20) as response:
                http_status = response.status
                body = response.read(2_000_000).decode('utf-8', errors='replace')
            if http_status == 200 and marker in body:
                return {'url': url, 'status': 'UP', 'http_status': http_status,
                        'attempts': attempt, 'seconds': round(time.monotonic() - started, 3),
                        'detail': 'HTTP 200 e conteúdo esperado presentes'}
            detail = f'HTTP {http_status}; conteúdo esperado ausente ou resposta inválida'
        except (URLError, TimeoutError, OSError) as error:
            http_status = getattr(error, 'code', None)
            detail = str(error)
        if attempt < 3:
            time.sleep(5)
    return {'url': url, 'status': 'DOWN', 'http_status': http_status,
            'attempts': 3, 'seconds': round(time.monotonic() - started, 3), 'detail': detail}


def main():
    results = [check_resource(path, marker) for path, marker in RESOURCES]
    status = 'UP' if all(result['status'] == 'UP' for result in results) else 'DOWN'
    timestamp = datetime.now(timezone.utc).isoformat()
    report = {'checked_at_utc': timestamp, 'status': status, 'resources': results}
    Path('monitoramento.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    lines = [f'# Monitoramento do site: {status}', '', f'Verificação em UTC: {timestamp}', '',
             '| Recurso | Estado | HTTP | Tempo (s) | Tentativas |',
             '| --- | --- | --- | --- | --- |']
    for result in results:
        lines.append(f"| {result['url']} | {result['status']} | {result['http_status']} | {result['seconds']} | {result['attempts']} |")
        print(f"{result['status']} {result['url']} HTTP={result['http_status']} "
              f"tempo={result['seconds']}s tentativas={result['attempts']} {result['detail']}")
    lines.extend(['', 'Agendamento a cada 30 minutos, nos minutos 17 e 47 de cada hora (UTC).',
                  'Verificação HTTP e conteúdo essencial; a interação visual é validada separadamente.',
                  'Falhas ficam visíveis no histórico do Actions e nas notificações de falha habilitadas na conta.'])
    summary = '\n'.join(lines) + '\n'
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a', encoding='utf-8') as stream:
            stream.write(summary)
    print(f'ESTADO FINAL: {status}')
    if status == 'DOWN':
        print('::error::Site DOWN: uma ou mais verificações falharam após três tentativas.')
    return 0 if status == 'UP' else 1


if __name__ == '__main__':
    raise SystemExit(main())
