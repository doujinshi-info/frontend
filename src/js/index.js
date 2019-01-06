'use strict';

import './../scss/main.scss';

import pace from 'pace-progress';
import {router} from './ui/router';

pace.start();
router.init();
