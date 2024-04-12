import csv
import sqlite3
from datetime import datetime, timedelta

db = 'mri_pred_analytics.db'
date = datetime.now() - timedelta(days=150)


def get_date(delta):
    nw_date = date + timedelta(days=delta)
    date_str = datetime.strftime(nw_date, '%Y-%m-%d %H:%M:%S')
    return date_str


def insert_mri_scan_data_without_date():
    try:
        connection = sqlite3.connect(db)
        cursor = connection.cursor()
        cnt = 0
        delta = 0
        scan_date = date
        with open('mri_scan_data.csv', 'r') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                if cnt == 0:
                    cnt += 1
                    continue

                if cnt % 20 == 0:
                    delta += 1
                    scan_date = get_date(delta)

                query = f'''INSERT INTO MRI_DATA (SCAN_DATETIME, SCAN_TYPE, SCAN_TIME, SNR, DRIFT_HZ, DRIFT_PPM, 
                GRAD_PERF, COIL_TYPE, ERROR_TEMP, SYS_TEMP, CYRO_BOIL_OFF, RF_POWER_PERCENT, GRAD_TEMP, GRAD_CURRENT, 
                X_AXIS_POS_MM, Y_AXIS_POS_MM, Z_AXIS_POS_MM, ERROR_CODE) VALUES ('{scan_date}','{row[0]}', {row[1]}, 
                {row[2]}, {row[3]}, {row[4]}, {row[5]}, '{row[6]}', {row[7]}, 
                {row[8]}, {row[9]}, {row[10]}, {row[11]}, {row[12]}, {row[13]}, {row[14]}, {row[15]}, '{row[16]}');
                '''
                cursor.execute(query)
                cnt += 1

        connection.commit()
        connection.close()

    except Exception as e:
        print(f"Exception while inserting record into table MRI_DATA with error - {e}")


def insert_mri_scan_data():
    try:
        connection = sqlite3.connect(db)
        cursor = connection.cursor()
        cnt = 0

        with open('mri_scan_data.csv', 'r') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                if cnt == 0:
                    cnt += 1
                    continue

                query = f'''INSERT INTO MRI_DATA (SCAN_DATE, SCAN_TYPE, SCAN_TIME, SNR, DRIFT_HZ, DRIFT_PPM, GRAD_PERF, 
                COIL_TYPE, ERROR_TEMP, SYS_TEMP, CYRO_BOIL_OFF, RF_POWER_PERCENT, GRAD_TEMP, GRAD_CURRENT, 
                X_AXIS_POS_MM, Y_AXIS_POS_MM, Z_AXIS_POS_MM, ERROR_CODE) VALUES ('{row[0]}', '{row[1]}', {row[2]}, 
                {row[3]}, {row[4]}, {row[5]}, {row[6]}, '{row[7]}', 
                {row[8]}, {row[9]}, {row[10]}, {row[11]}, {row[12]}, 
                {row[13]}, {row[14]}, {row[15]}, {row[16]}, '{row[17]}');
                '''
                cursor.execute(query)
                cnt += 1

        connection.commit()
        connection.close()

    except Exception as e:
        print(f"Exception while inserting record into table MRI_DATA with error - {e}")


def truncate_table(table_name):
    connection = sqlite3.connect(db)
    cursor = connection.cursor()
    cursor.execute(f'''DELETE FROM {table_name}''')
    connection.commit()
    connection.close()


def display_data(table_name, rows):
    connection = sqlite3.connect(db)
    cursor = connection.cursor()
    output = cursor.execute(f'''SELECT * FROM {table_name} ORDER BY ID DESC LIMIT {rows}''')
    print(output.fetchall())
    connection.close()


if __name__ == '__main__':
    insert_mri_scan_data()
    display_data('MRI_DATA', 20)
