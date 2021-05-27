import os
from posixpath import join 
import sys
import mariadb

names = {
   'binancebrl':'binance_brl',
   'binanceusd':'binance_usd',
   'binanceeur':'binance_eur',
   'biscoint':'biscoint',
   'bitpreco':'bitpreco'
}
path = f'{os.getcwd()}/data/price_btc'

if os.getenv('ENVIRONMENT') != 'production':
    from dotenv import load_dotenv
    load_dotenv()

def addToDatabase(arr):
    try:
        conn = mariadb.connect(
            user=os.getenv('BTCBOT_SQLUSER'),
            password=os.getenv('BTCBOT_SQLPASSWD'),
            host=os.getenv('BTCBOT_SQLHOST'),
            port=int(os.getenv('BTCBOT_SQLPORT'))
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)
    cur = conn.cursor()
    try:
        cur.executemany(f"INSERT INTO {os.getenv('BTCBOT_SQLDATABASE')}.price (name, price, datetime) VALUES (?, ?, ?)", arr)
        conn.commit()
    except mariadb.Error as e:
        print (f'Error: {e}')
    conn.close()

def getOldData(path, names):
    files = [f for f in os.listdir(path) if os.path.isfile(join(path, f))]
    for name in names:
        result = []
        for file in files: 
            if file.startswith(name):
                contentOpen = open(join(path, file))
                allContent = contentOpen.read()
                allContent = allContent.split('\n')
                for content in allContent:
                    content = content.split(',')
                    if len(content) == 2 and len(content[0]) == 8:
                        time = content[0]
                        price = content[1]
                        date = file.replace(name, '').replace('.txt', '')
                        datetime = f'{date} {time}'
                        result.append((names[name], float(price), datetime))
        addToDatabase(result)
    return True

allData = getOldData(path, names)
