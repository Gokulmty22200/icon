import sqlite3

db = 'mri_pred_analytics.db'


def create_db_objects():
    try:
        connection = sqlite3.connect(db)
        cursor = connection.cursor()

        # create table for MRI DATA
        cursor.execute('''CREATE TABLE IF NOT EXISTS MRI_DATA
                            (
                                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                                SCAN_DATE DATE,
                                SCAN_TYPE CHAR(100),
                                SCAN_TIME INTEGER,
                                SNR REAL,
                                DRIFT_HZ REAL,
                                DRIFT_PPM REAL,
                                GRAD_PERF REAL,
                                COIL_TYPE CHAR(100),
                                ERROR_TEMP REAL,
                                SYS_TEMP REAL,
                                CYRO_BOIL_OFF REAL,
                                RF_POWER_PERCENT REAL,
                                GRAD_TEMP REAL,
                                GRAD_CURRENT INTEGER,
                                X_AXIS_POS_MM REAL,
                                Y_AXIS_POS_MM REAL,
                                Z_AXIS_POS_MM REAL,
                                ERROR_CODE CHAR(100)   
                            )                    
                        '''
                       )

        connection.commit()
        connection.close()

    except Exception as e:
        print(f"Exception while executing create table DDL with error {e}")


if __name__ == '__main__':
    create_db_objects()
