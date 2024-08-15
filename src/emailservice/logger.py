#!/usr/bin/python
#
# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
import json
import logging
import os  # Import the os module
from pythonjsonlogger import jsonlogger

# TODO(yoshifumi) this class is duplicated since other Python services are
# not sharing the modules for logging.
class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        if not log_record.get('timestamp'):
            log_record['timestamp'] = record.created
        if log_record.get('severity'):
            log_record['severity'] = log_record['severity'].upper()
        else:
            log_record['severity'] = record.levelname

def getJSONLogger(name):
    logger = logging.getLogger(name)
    handler = logging.StreamHandler(sys.stdout)
    formatter = CustomJsonFormatter('%(timestamp)s %(severity)s %(name)s %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False
    return logger



class Logger:
    def __init__(self, name, log_file='app.log'):
        self.name = name
        self.log_file = log_file
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)

        # Create log file if it doesn't exist
        if not os.path.exists(log_file):
            open(log_file, 'w').close()

        handler = logging.FileHandler(log_file)
        handler.setFormatter(logging.Formatter('%(message)s'))
        self.logger.addHandler(handler)

    def info(self, message):
        formatted_message = f"[INFO] {self.name}: {message}"
        self.logger.info(formatted_message)
        with open(self.log_file, 'a') as f:
            f.write(formatted_message + "\n")

def getJSONLogger(name):
    return Logger(name)
