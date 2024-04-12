from flask import Flask, request, make_response
from flask_cors import CORS
import traceback
import sqlite3
from datetime import datetime

db = 'mri_pred_analytics.db'

app = Flask(__name__)
CORS(app)


def meta_info():
    return ({
        'version': 'v1'
    })


def get_error_msg(msg_code):
    app.logger.info(f"error due to {msg_code}")
    messages = {
        "UNKNOWN": "Encountered an unknown error",
        "DATA_NOT_FOUND": "No Data Found"
    }
    return messages[msg_code]


@app.route('/mri/get-total-scan-count', methods=['POST'])
def get_total_scan_count():
    data = {}
    error = {}
    meta = meta_info()
    try:
        request_data = request.get_json()

        if 'month' in request_data.keys():
            month = request_data.get('month_code')
        else:
            month = datetime.strftime(datetime.now(), '%m')

        if 'year' in request_data.keys():
            year = request_data.get('year')
        else:
            year = datetime.strftime(datetime.now(), '%Y')

        connection = sqlite3.connect(db)
        cursor = connection.cursor()
        query_output = cursor.execute(f'''SELECT COUNT(SCAN_TYPE) AS SCAN_COUNT
                                            FROM MRI_DATA
                                                WHERE STRFTIME('%m', SCAN_DATE) = '{month}'
                                                AND STRFTIME('%Y', SCAN_DATE) = '{year}'
                                                ORDER BY SCAN_TYPE;
                                        ''')
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row))
                  for row in query_output.fetchall()]

        if result:
            api_response = result
        else:
            api_response = []

    except Exception as e:
        app.logger.info(f"Exception in API with error {e}")
        meta["state"] = 'ERROR'
        error = {'msg': get_error_msg("UNKNOWN"), 'trace': traceback.format_exc()}
        app.logger.info(error["msg"])

    else:
        app.logger.info('Things are fine')
        meta["state"] = 'SUCCESS'
        data = api_response
        print(data)

    finally:
        app.logger.info('Finally lets wrap up')
        return make_response({
            'meta': meta,
            'data': data,
            'error': error
        })


@app.route('/mri/get-avg-scan-time', methods=['POST'])
def get_avg_scan_time():
    data = {}
    error = {}
    meta = meta_info()
    try:
        request_data = request.get_json()

        if 'month' in request_data.keys():
            month = request_data.get('month_code')
        else:
            month = datetime.strftime(datetime.now(), '%m')

        if 'year' in request_data.keys():
            year = request_data.get('year')
        else:
            year = datetime.strftime(datetime.now(), '%Y')

        if 'scan_type' in request_data.keys():
            scan_type = request_data.get('scan_type')
        else:
            scan_type = None

        if scan_type:
            query_string = f"AND SCAN_TYPE = '{scan_type}'"
        else:
            query_string = ''

        connection = sqlite3.connect(db)
        cursor = connection.cursor()
        query_output = cursor.execute(f'''SELECT AVG(SCAN_TIME) AS SCAN_TIME
                                            FROM MRI_DATA
                                                WHERE STRFTIME('%m', SCAN_DATE) = '{month}'
                                                AND STRFTIME('%Y', SCAN_DATE) = '{year}'
                                                {query_string}
                                                ORDER BY SCAN_TYPE;
                                        ''')
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row))
                  for row in query_output.fetchall()]

        if result:
            api_response = result
        else:
            api_response = []

    except Exception as e:
        app.logger.info(f"Exception in API with error {e}")
        meta["state"] = 'ERROR'
        error = {'msg': get_error_msg("UNKNOWN"), 'trace': traceback.format_exc()}
        app.logger.info(error["msg"])

    else:
        app.logger.info('Things are fine')
        meta["state"] = 'SUCCESS'
        data = api_response
        print(data)

    finally:
        app.logger.info('Finally lets wrap up')
        return make_response({
            'meta': meta,
            'data': data,
            'error': error
        })


@app.route('/mri/get-total-error-count', methods=['POST'])
def get_total_error_count():
    data = {}
    error = {}
    meta = meta_info()
    try:
        request_data = request.get_json()

        if 'month' in request_data.keys():
            month = request_data.get('month_code')
        else:
            month = datetime.strftime(datetime.now(), '%m')

        if 'year' in request_data.keys():
            year = request_data.get('year')
        else:
            year = datetime.strftime(datetime.now(), '%Y')

        connection = sqlite3.connect(db)
        cursor = connection.cursor()
        query_output = cursor.execute(f'''SELECT COUNT(SCAN_TYPE) AS COUNT
                                            FROM MRI_DATA
                                                WHERE STRFTIME('%m', SCAN_DATE) = '{month}'
                                                AND STRFTIME('%Y', SCAN_DATE) = '{year}'
                                                AND ERROR_CODE != 'No Error';
                                        ''')
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row))
                  for row in query_output.fetchall()]

        if result:
            api_response = result
        else:
            api_response = []

    except Exception as e:
        app.logger.info(f"Exception in API with error {e}")
        meta["state"] = 'ERROR'
        error = {'msg': get_error_msg("UNKNOWN"), 'trace': traceback.format_exc()}
        app.logger.info(error["msg"])

    else:
        app.logger.info('Things are fine')
        meta["state"] = 'SUCCESS'
        data = api_response
        print(data)

    finally:
        app.logger.info('Finally lets wrap up')
        return make_response({
            'meta': meta,
            'data': data,
            'error': error
        })


@app.route('/mri/get-code-wise-error-count', methods=['POST'])
def get_code_wise_error_count():
    data = {}
    error = {}
    meta = meta_info()
    try:
        request_data = request.get_json()

        if 'month' in request_data.keys():
            month = request_data.get('month_code')
        else:
            month = datetime.strftime(datetime.now(), '%m')

        if 'year' in request_data.keys():
            year = request_data.get('year')
        else:
            year = datetime.strftime(datetime.now(), '%Y')

        connection = sqlite3.connect(db)
        cursor = connection.cursor()
        query_output = cursor.execute(f'''SELECT ERROR_CODE, COUNT(ERROR_CODE) AS COUNT
                                            FROM MRI_DATA
                                                WHERE STRFTIME('%m', SCAN_DATE) = '{month}'
                                                AND STRFTIME('%Y', SCAN_DATE) = '{year}'
                                                GROUP BY ERROR_CODE
                                                HAVING ERROR_CODE != 'No Error'
                                                ORDER BY COUNT(ERROR_CODE) DESC;
                                        ''')
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row))
                  for row in query_output.fetchall()]

        if result:
            api_response = result
        else:
            api_response = []

    except Exception as e:
        app.logger.info(f"Exception in API with error {e}")
        meta["state"] = 'ERROR'
        error = {'msg': get_error_msg("UNKNOWN"), 'trace': traceback.format_exc()}
        app.logger.info(error["msg"])

    else:
        app.logger.info('Things are fine')
        meta["state"] = 'SUCCESS'
        data = api_response
        print(data)

    finally:
        app.logger.info('Finally lets wrap up')
        return make_response({
            'meta': meta,
            'data': data,
            'error': error
        })


@app.route('/mri/get-month-wise-error-count', methods=['GET'])
def get_month_wise_error_count():
    data = {}
    error = {}
    meta = meta_info()
    try:

        connection = sqlite3.connect(db)
        cursor = connection.cursor()
        query_output = cursor.execute(f'''SELECT    STRFTIME('%m', SCAN_DATE) AS MONTH, 
                                                    ERROR_CODE, 
                                                    COUNT(ERROR_CODE) AS COUNT
                                            FROM MRI_DATA
                                                GROUP BY STRFTIME('%m', SCAN_DATE), ERROR_CODE
                                                HAVING ERROR_CODE != 'No Error'
                                                ORDER BY STRFTIME('%m', SCAN_DATE), ERROR_CODE DESC;
                                        ''')
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row))
                  for row in query_output.fetchall()]

        if result:
            api_response = result
        else:
            api_response = []

    except Exception as e:
        app.logger.info(f"Exception in API with error {e}")
        meta["state"] = 'ERROR'
        error = {'msg': get_error_msg("UNKNOWN"), 'trace': traceback.format_exc()}
        app.logger.info(error["msg"])

    else:
        app.logger.info('Things are fine')
        meta["state"] = 'SUCCESS'
        data = api_response
        print(data)

    finally:
        app.logger.info('Finally lets wrap up')
        return make_response({
            'meta': meta,
            'data': data,
            'error': error
        })


@app.route('/mri/get-avg-snr', methods=['POST'])
def get_avg_snr():
    data = {}
    error = {}
    meta = meta_info()
    try:
        request_data = request.get_json()

        if 'month' in request_data.keys():
            month = request_data.get('month_code')
        else:
            month = datetime.strftime(datetime.now(), '%m')

        if 'year' in request_data.keys():
            year = request_data.get('year')
        else:
            year = datetime.strftime(datetime.now(), '%Y')

        connection = sqlite3.connect(db)
        cursor = connection.cursor()
        query_output = cursor.execute(f'''SELECT SCAN_TYPE, AVG(SNR) AS AVG
                                            FROM MRI_DATA
                                                WHERE STRFTIME('%m', SCAN_DATE) = '{month}'
                                                AND STRFTIME('%Y', SCAN_DATE) = '{year}'
                                                GROUP BY SCAN_TYPE
                                                ORDER BY SCAN_TYPE;
                                        ''')
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row))
                  for row in query_output.fetchall()]

        if result:
            api_response = result
        else:
            api_response = []

    except Exception as e:
        app.logger.info(f"Exception in API with error {e}")
        meta["state"] = 'ERROR'
        error = {'msg': get_error_msg("UNKNOWN"), 'trace': traceback.format_exc()}
        app.logger.info(error["msg"])

    else:
        app.logger.info('Things are fine')
        meta["state"] = 'SUCCESS'
        data = api_response
        print(data)

    finally:
        app.logger.info('Finally lets wrap up')
        return make_response({
            'meta': meta,
            'data': data,
            'error': error
        })


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
