#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fetch from 'node-fetch';
var licenses = [];
var licenseNames = [];
var getLicenseList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetch('https://api.github.com/licenses').then(function (res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, res.json()];
                    }); }); })];
            case 1:
                response = _a.sent();
                if (Array.isArray(response)) {
                    licenses = response;
                    response === null || response === void 0 ? void 0 : response.forEach(function (lic) {
                        licenseNames.push(lic.name);
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                throw new Error(chalk.red(error_1));
            case 3: return [2 /*return*/];
        }
    });
}); };
var getLicense = function (licenseName) { return __awaiter(void 0, void 0, void 0, function () {
    var license;
    return __generator(this, function (_a) {
        try {
            license = licenses.find(function (lic) { return lic.name === licenseName; });
            return [2 /*return*/, license];
        }
        catch (error) {
            throw new Error(chalk.red(error));
        }
        return [2 /*return*/];
    });
}); };
var getGithubDetails = function (userName) { return __awaiter(void 0, void 0, void 0, function () {
    var githubDetails, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetch("https://api.github.com/users/".concat(userName)).then(function (res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, res.json()];
                    }); }); })];
            case 1:
                githubDetails = _a.sent();
                return [2 /*return*/, githubDetails];
            case 2:
                error_2 = _a.sent();
                throw new Error(chalk.red(error_2));
            case 3: return [2 /*return*/];
        }
    });
}); };
var createLicenseFile = function (license, userName) { return __awaiter(void 0, void 0, void 0, function () {
    var licenseDetails, year, githubDetails, licenseBody, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, fetch(license.url).then(function (res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, res.json()];
                    }); }); })];
            case 1:
                licenseDetails = _b.sent();
                year = new Date().getFullYear();
                return [4 /*yield*/, getGithubDetails(userName)];
            case 2:
                githubDetails = _b.sent();
                licenseBody = licenseDetails === null || licenseDetails === void 0 ? void 0 : licenseDetails.body.replace('[year]', year).replace('[fullname]', (_a = githubDetails === null || githubDetails === void 0 ? void 0 : githubDetails.name) !== null && _a !== void 0 ? _a : userName);
                return [4 /*yield*/, fs.writeFile(path.join(process.cwd(), 'LICENSE'), licenseBody)];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                throw new Error(chalk.red(error_3));
            case 5: return [2 /*return*/];
        }
    });
}); };
var writePackageJson = function (license) { return __awaiter(void 0, void 0, void 0, function () {
    var packageJsonPath, packageJsonFile, packageJson, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                packageJsonPath = path.join(process.cwd(), 'package.json');
                return [4 /*yield*/, fs.readFile(packageJsonPath, { encoding: 'utf-8' })];
            case 1:
                packageJsonFile = _a.sent();
                packageJson = JSON.parse(packageJsonFile);
                packageJson.license = license.spdx_id;
                return [4 /*yield*/, fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                if (error_4.path) {
                    console.error(chalk.red('Not exist package.json : ' + error_4.path));
                    throw new Error(chalk.red(error_4));
                }
                else {
                    throw new Error(chalk.red(error_4));
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var answers, license, error_5, error_;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                return [4 /*yield*/, getLicenseList()];
            case 1:
                _b.sent();
                console.log(chalk.yellow(chalk.green('Gen') + 'erate ' + chalk.green('Lic') + 'ense ' + chalk.green(':)')));
                return [4 /*yield*/, inquirer.prompt([
                        {
                            type: 'input',
                            name: 'githubUserName',
                            message: 'Github username?',
                            default: 'ibodev1',
                        },
                        {
                            type: 'list',
                            name: 'licenseName',
                            message: 'Select license...',
                            choices: licenseNames,
                            default: 'MIT License',
                        },
                        {
                            type: 'confirm',
                            name: 'packageJson',
                            message: 'Write package.json',
                            default: true,
                        },
                    ])];
            case 2:
                answers = _b.sent();
                return [4 /*yield*/, getLicense(answers.licenseName)];
            case 3:
                license = (_a = _b.sent()) !== null && _a !== void 0 ? _a : {
                    key: '',
                    name: '',
                    node_id: '',
                    spdx_id: '',
                    url: '',
                };
                return [4 /*yield*/, createLicenseFile(license, answers.githubUserName)];
            case 4:
                _b.sent();
                if (!answers.packageJson) return [3 /*break*/, 6];
                return [4 /*yield*/, writePackageJson(license)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_5 = _b.sent();
                error_ = error_5.isTtyError ? new Error(chalk.red('isTtyError')) : new Error(chalk.red(error_5));
                throw error_;
            case 8: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=cli.js.map