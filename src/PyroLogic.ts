import _ from 'lodash';
import dayjs from 'dayjs';

import { 
    Furnace, 
    FurnaceClass, 
    InstrumentationType, 
    LoadEntryOptions, 
    ControlSystem,
    InstrumentModel,
    TimeInterval,
    PyroStatus,
    ControlSystemType,
    Instrument,
    ControlSystemAndStuff,
    Specification,
    Thermocouple,
    BaseMetalType,
    FurnaceControlSystem,
    InstrumentChannelCalibration,
    ThermocoupleCalibration,
    ThermocoupleCalibrationRuleset,
    InstrumentCalibrationRuleset
} from './DataStructures';

export default class PyroLogic {

    static getAllowableThermocoupleDifference(rulesets: ThermocoupleCalibrationRuleset[], testTemperature: number, inputValue: number, options: LoadEntryOptions): number {
        if(rulesets.length === 0) {
            return inputValue;
        }
        const differences = rulesets.map(v => Math.max(testTemperature * v.percentDifference/100, options.temperatureUnit === 'F' ? v.calibrationAccuracyFahrenheit : v.calibrationAccuracyCelsius));
        const minDifference = Math.min(...differences);
        return minDifference;
    }

    static getAllowableInstrumentDifference(rulesets: InstrumentCalibrationRuleset[], testTemperature: number, inputValue: number, options: LoadEntryOptions): number {
        if(rulesets.length === 0) {
            return inputValue;
        }
        const differences = rulesets.map(v => Math.max(testTemperature * v.percentDifference/100, options.temperatureUnit === 'F' ? v.calibrationAccuracyFahrenheit : v.calibrationAccuracyCelsius));
        const minDifference = Math.min(...differences);
        return minDifference;
    }

    static determineIfInstrumentCalPassed(rulesets: InstrumentCalibrationRuleset[]) {

    }

    static getInstrumentRulesets(controlSystemAndStuff: ControlSystemAndStuff, specifications: Specification[]): InstrumentCalibrationRuleset[] {
        const allRulesets = specifications.flatMap(v => v.instrumentCalibrationRulesets);
        const filteredRulesets = allRulesets.filter(v => 
            v.instrumentClassificationId === controlSystemAndStuff.instrument.instrumentClassificationId &&
            v.furnaceClassId === controlSystemAndStuff.furnace.furnaceClassId);
        return filteredRulesets;
    }

    static getThermocoupleRulesets(controlSystemAndStuff: ControlSystemAndStuff, specifications: Specification[]): ThermocoupleCalibrationRuleset[] {
        const allRulesets = specifications.flatMap(v => v.thermocoupleCalibrationRulesets);
        const filteredRulesets = allRulesets.filter(v => 
            v.thermocoupleClassificationId === controlSystemAndStuff.thermocouple.thermocoupleClassificationId && 
            v.baseMetalTypeId === controlSystemAndStuff.baseMetalType.baseMetalTypeId && 
            v.furnaceClassId === controlSystemAndStuff.furnace.furnaceClassId);
        return filteredRulesets;
    }

    static getSpecificationsFromFurnace(furnace: Furnace, specifications: Record<string, Specification>): Specification[] {
        const ret = furnace.specifications.map(v => specifications[v.specificationId]).filter(v => v !== undefined);
        return ret;
    }

    static getInstrumentStatus(
        controlSystemAndStuff: ControlSystemAndStuff, 
        specificationsFromFurnace: Specification[],
        timeIntervals: Record<string, TimeInterval>,
        now: Date): PyroStatus {
        if(controlSystemAndStuff.instrumentModel.isSoftware) {
            return PyroStatus.notCalibratable;
        }
        const lastCalibrationDate = this.getLastInstrumentCalibrationDate(controlSystemAndStuff);
        if(lastCalibrationDate === null) {
            return PyroStatus.invalid;
        }

        const allStatuses = specificationsFromFurnace.map(v => this.getSingleSpecificationInstrumentStatus(controlSystemAndStuff, v, timeIntervals, lastCalibrationDate, now));
        const allAreValid = allStatuses.every(v => v === PyroStatus.valid);
        const ret = allAreValid ? PyroStatus.valid : PyroStatus.invalid;
        return ret;
    }

    static getThermocoupleStatus(
        controlSystemAndStuff: ControlSystemAndStuff, 
        specificationsFromFurnace: Specification[],
        timeIntervals: Record<string, TimeInterval>,
        now: Date): PyroStatus {
        const lastCalibrationDate = this.getLastThermocoupleCalibrationDate(controlSystemAndStuff);
        if(lastCalibrationDate === null) {
            return PyroStatus.invalid;
        }

        const allStatuses = specificationsFromFurnace.map(v => this.getSingleSpecificationThermocoupleStatus(controlSystemAndStuff, v, timeIntervals, lastCalibrationDate, now));
        const allAreValid = allStatuses.every(v => v === PyroStatus.valid);
        const ret = allAreValid ? PyroStatus.valid : PyroStatus.invalid;
        return ret;
    }

    static getSingleSpecificationThermocoupleStatus(
        controlSystemAndStuff: ControlSystemAndStuff, 
        specification: Specification, 
        timeIntervals: Record<string, TimeInterval>,
        lastCalibrationDate: Date,
        now: Date): PyroStatus {
        const theRuleset = specification.thermocoupleCalibrationRulesets.filter(
            v => v.furnaceClassId === controlSystemAndStuff.furnace.furnaceClassId && 
            v.baseMetalTypeId === controlSystemAndStuff.baseMetalType.baseMetalTypeId &&
            v.thermocoupleClassificationId === controlSystemAndStuff.thermocouple.thermocoupleClassificationId)[0];
        if(theRuleset === undefined) {
            return this.getStatusByThermocouplesSetTimeInterval(controlSystemAndStuff, timeIntervals, lastCalibrationDate, now);
        }
        else if(theRuleset.calibrationIntervalId === 1){
            return controlSystemAndStuff.thermocouple.calibrations.length > 0 ? PyroStatus.valid : PyroStatus.invalid;
        }
        else {
            const calibrationIntervalId = theRuleset.calibrationIntervalId;
            const timeInterval = timeIntervals[calibrationIntervalId];
            const hasExpired = this.hasDateExpired(lastCalibrationDate, now, timeInterval);
            return hasExpired ? PyroStatus.invalid : PyroStatus.valid;
        }
    }

    static getSingleSpecificationInstrumentStatus(
        controlSystemAndStuff: ControlSystemAndStuff, 
        specification: Specification, 
        timeIntervals: Record<string, TimeInterval>,
        lastCalibrationDate: Date,
        now: Date): PyroStatus {
        const theRuleset = specification.instrumentCalibrationRulesets.filter(
            v => v.furnaceClassId === controlSystemAndStuff.furnace.furnaceClassId && 
            v.instrumentTypeId === controlSystemAndStuff.furnace.instrumentationTypeId &&
            v.instrumentClassificationId === controlSystemAndStuff.instrument.instrumentClassificationId)[0];
        if(theRuleset === undefined) {
            return this.getStatusByInstrumentSetTimeInterval(controlSystemAndStuff, timeIntervals, lastCalibrationDate, now);
        }
        else {
            const maxCalibrationIntervalId = theRuleset.maxCalibrationIntervalId;
            const timeInterval = timeIntervals[maxCalibrationIntervalId];
            const hasExpired = this.hasDateExpired(lastCalibrationDate, now, timeInterval);
            return hasExpired ? PyroStatus.invalid : PyroStatus.valid;
        }
    }

    static getStatusByThermocouplesSetTimeInterval(
        controlSystemAndStuff: ControlSystemAndStuff,
        timeIntervals: Record<string, TimeInterval>,
        lastCalibrationDate: Date,
        now: Date):PyroStatus {
            const calibrationIntervalId = controlSystemAndStuff.thermocouple.calibrationIntervalId;
            const timeInterval = timeIntervals[calibrationIntervalId];
            const hasExpired = this.hasDateExpired(lastCalibrationDate, now, timeInterval);
            return hasExpired ? PyroStatus.invalid : PyroStatus.valid;
    }

    static getStatusByInstrumentSetTimeInterval(
        controlSystemAndStuff: ControlSystemAndStuff,
        timeIntervals: Record<string, TimeInterval>,
        lastCalibrationDate: Date,
        now: Date):PyroStatus {
            const calibrationIntervalId = controlSystemAndStuff.instrument.calibrationIntervalId;
            const timeInterval = timeIntervals[calibrationIntervalId];
            const hasExpired = this.hasDateExpired(lastCalibrationDate, now, timeInterval);
            return hasExpired ? PyroStatus.invalid : PyroStatus.valid;
    }

    static getLastInstrumentCalibrationDateText(controlSystemAndStuff: ControlSystemAndStuff): string {
        if(controlSystemAndStuff.instrumentModel.isSoftware) {
            return "";
        }
        const date = this.getLastInstrumentCalibrationDate(controlSystemAndStuff);
        if(date === null) {
            return "Never Calibrated";
        }
        return this.convertUtcDateToLocalString24(date);
    }

    static convertUtcDateToLocalString24(date: Date): string {
        const utcDate = this.convertUtcDateToLocal(date);
        return dayjs(utcDate).format('M/D/YYYY H:mm:ss');
    }

    static convertUtcDateToLocalString12(date: Date): string {
        const utcDate = this.convertUtcDateToLocal(date);
        return dayjs(utcDate).format('M/D/YYYY h:mm:ss A');
    }

    static convertUtcDateToLocal(date: Date): Date {
        //https://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time
        const tempDate = dayjs(date).format('M/D/YYYY H:mm:ss');
        const utcDate = new Date(tempDate + " UTC");
        return utcDate;
    }

    static getLastInstrumentCalibrationDate(controlSystemAndStuff: ControlSystemAndStuff): Date | null {
        const last = this.getLastInstrumentCalibration(controlSystemAndStuff)
        if(last === null || !last.passed) {
            return null;
        }
        return new Date(last.calibrationDate);
    }

    static getLastInstrumentCalibration(controlSystemAndStuff: ControlSystemAndStuff): InstrumentChannelCalibration | null {
        const instrument = controlSystemAndStuff.instrument;
        const controlSystem = controlSystemAndStuff.controlSystem;
        const channel = instrument.channels.filter(v => controlSystem.channel === v.channel)[0];
        if(channel === undefined) {
            return null;
        }
        const orderedCalibrations = _.sortBy(channel.calibrations, v => new Date(v.calibrationDate));
        const last = _.last(orderedCalibrations);
        if(last === undefined) {
            return null;
        }
        return last;
    }

    static getLastThermocoupleCalibrationDateText(controlSystemAndStuff: ControlSystemAndStuff): string {
        if(controlSystemAndStuff.instrumentModel.isSoftware) {
            return "";
        }
        const date = this.getLastThermocoupleCalibrationDate(controlSystemAndStuff);
        if(date === null) {
            return "Never Calibrated";
        }
        return this.convertUtcDateToLocalString24(date);
    }

    static getLastThermocoupleCalibrationDate(controlSystemAndStuff: ControlSystemAndStuff): Date | null {
        const last = this.getLastThermocoupleCalibration(controlSystemAndStuff);
        if(last === null || !last.passed) {
            return null;
        }
        return new Date(last.calibrationDate);
    }

    static getLastThermocoupleCalibration(controlSystemAndStuff: ControlSystemAndStuff): ThermocoupleCalibration | null {
        const thermocouple = controlSystemAndStuff.thermocouple;
        const calibrations = thermocouple.calibrations;
        const orderedCalibrations = _.sortBy(calibrations, v => new Date(v.calibrationDate));
        const last = _.last(orderedCalibrations);
        if(last === undefined) {
            return null;
        }
        return last;
    }

    static getTusStatus(
        now: Date,
        furnace: Furnace, 
        furnaceClass: FurnaceClass,
        controlSystemsAndStuff: ControlSystemAndStuff[],
        specificationsFromFurnace: Specification[],
        timeIntervals: Record<string, TimeInterval>): PyroStatus
    {
        const lastTusDate = this.getLastTusDate(controlSystemsAndStuff);
        const tusInterval = this.getTusTimeInterval(furnace, furnaceClass);
        const instrumentStatuses = controlSystemsAndStuff.map(v => this.getInstrumentStatus(v, specificationsFromFurnace, timeIntervals, now));
        const overallInstrumentStatus = instrumentStatuses.every(v => v !== PyroStatus.invalid) ? PyroStatus.valid : PyroStatus.invalid;
        const thermocoupleStatuses = controlSystemsAndStuff.map(v => this.getThermocoupleStatus(v, specificationsFromFurnace, timeIntervals, now));
        const overallThermocoupleStatuses = thermocoupleStatuses.every(v => v !== PyroStatus.invalid) ? PyroStatus.valid : PyroStatus.invalid;
        if(lastTusDate === null || tusInterval === null || overallInstrumentStatus === PyroStatus.invalid || overallThermocoupleStatuses === PyroStatus.invalid) {
            return PyroStatus.invalid;
        }
        const hasDateExpired = this.hasDateExpired(lastTusDate, now, tusInterval);
        return hasDateExpired ? PyroStatus.invalid : PyroStatus.valid;
    }

    static getNextTusDateText(
        furnace: Furnace, 
        furnaceClass: FurnaceClass,
        controlSystemsAndStuff: ControlSystemAndStuff[]
        ): string
    {
        const date = this.getNextTusDate(furnace, furnaceClass, controlSystemsAndStuff);
        if(date === null) {
            return "As Soon As Possible";
        }
        return date.toDateString();
    }

    static getNextTusDate(furnace: Furnace, furnaceClass: FurnaceClass, controlSystemsAndStuff: ControlSystemAndStuff[]): Date | null
    {
        const lastTusDate = this.getLastTusDate(controlSystemsAndStuff);
        if(lastTusDate === null) {
            return null;
        }
        const tusInterval = this.getTusTimeInterval(furnace, furnaceClass);
        if(tusInterval === null) {
            return null;
        }
        const ret = this.addTimeInterval(lastTusDate, tusInterval);
        return ret;
    }

    static getLastTusDateText(controlSystemsAndStuff: ControlSystemAndStuff[]): string {
        const date = this.getLastTusDate(controlSystemsAndStuff);
        if(date === null) {
            return "Never Tested";
        }
        return date.toDateString();
    }

    static getLastTusDate(controlSystemsAndStuff: ControlSystemAndStuff[]): Date | null {
        const nonSoftware = this.getNonSoftwareControlSystems(controlSystemsAndStuff);
        const tusTests = nonSoftware.flatMap(v => v.furnaceControlSystem.tusTests).filter(v => v.passed);
        const sortedByEndTime = _.sortBy(tusTests, v => new Date(v.endTime));
        const last = _.last(sortedByEndTime);
        if(last === undefined || !last.passed) {
            return null;
        }
        return new Date(last.endTime);
    }

    static getStatusColor(pyroStatus: PyroStatus): string {
        if(pyroStatus === PyroStatus.invalid) {
            return 'red';
        }
        else if(pyroStatus === PyroStatus.valid) {
            return 'green';
        }
        else {
            return 'white';
        }
    }

    static getSatStatus(
        now: Date,
        furnace: Furnace, 
        furnaceClass: FurnaceClass,
        controlSystemsAndStuff: ControlSystemAndStuff[],
        specificationsFromFurnace: Specification[],
        timeIntervals: Record<string, TimeInterval>): PyroStatus
    {
        const lastSatDate = this.getLastSatDate(controlSystemsAndStuff);
        const satInterval = this.getSatTimeInterval(furnace, furnaceClass);
        const instrumentStatuses = controlSystemsAndStuff.map(v => this.getInstrumentStatus(v, specificationsFromFurnace, timeIntervals, now));
        const overallInstrumentStatus = instrumentStatuses.every(v => v !== PyroStatus.invalid) ? PyroStatus.valid : PyroStatus.invalid;
        const thermocoupleStatuses = controlSystemsAndStuff.map(v => this.getThermocoupleStatus(v, specificationsFromFurnace, timeIntervals, now));
        const overallThermocoupleStatuses = thermocoupleStatuses.every(v => v !== PyroStatus.invalid) ? PyroStatus.valid : PyroStatus.invalid;
        if(lastSatDate === null || satInterval === null || overallInstrumentStatus === PyroStatus.invalid || overallThermocoupleStatuses === PyroStatus.invalid) {
            return PyroStatus.invalid;
        }
        const hasDateExpired = this.hasDateExpired(lastSatDate, now, satInterval);
        return hasDateExpired ? PyroStatus.invalid : PyroStatus.valid;
    }

    static getSatTimeInterval(furnace: Furnace, furnaceClass: FurnaceClass): TimeInterval | null {
        if(furnaceClass === undefined) {
            return null;
        }
        const satRulesets = furnaceClass.satRulesets;
        const theSatRuleset = satRulesets.filter(v => v.instrumentationTypeId === furnace.instrumentationTypeId && v.isParts === furnace.isPartsFurnace)[0];
        if(theSatRuleset === undefined) {
            return null;
        }
        if(furnace.isUnderMaintenanceProgram) {
            return theSatRuleset.normalTestInterval;
        } 
        else {
            return theSatRuleset.extendedTestInterval;
        }
    }

    static getTusTimeInterval(furnace: Furnace, furnaceClass: FurnaceClass): TimeInterval | null {
        if(furnaceClass === undefined) {
            return null;
        }
        const tusRulesets = furnaceClass.tusRulesets;
        const theTusRuleset = tusRulesets.filter(v => v.instrumentationTypeId === furnace.instrumentationTypeId && v.isParts === furnace.isPartsFurnace)[0];
        if(theTusRuleset === undefined) {
            return null;
        }
        if(furnace.isUnderMaintenanceProgram) {
            return theTusRuleset.normalTestInterval;
        } 
        else {
            return theTusRuleset.extendedTestInterval;
        }
    }

    static getNextSatDateText(
        furnace: Furnace, 
        furnaceClass: FurnaceClass,
        controlSystemsAndStuff: ControlSystemAndStuff[]
        ): string
    {
        const date = this.getNextSatDate(furnace, furnaceClass, controlSystemsAndStuff);
        if(date === null) {
            return "As Soon As Possible";
        }
        return date.toDateString();
    }

    static getNextSatDate(
        furnace: Furnace, 
        furnaceClass: FurnaceClass,
        controlSystemsAndStuff: ControlSystemAndStuff[]
        ): Date | null
    {
        const lastSatDate = this.getLastSatDate(controlSystemsAndStuff);
        if(lastSatDate === null) {
            return null;
        }
        const satInterval = this.getSatTimeInterval(furnace, furnaceClass);
        if(satInterval === null) {
            return null;
        }
        const ret = this.addTimeInterval(lastSatDate, satInterval);
        return ret;
    }

    static addTimeInterval(date: Date, timeInterval: TimeInterval): Date {
        return dayjs(date)
        .add(timeInterval.days, 'days')
        .add(timeInterval.weeks, 'weeks')
        .add(timeInterval.months, 'months')
        .add(timeInterval.years, 'years')
        .toDate();
    }

    static hasDateExpired(questionDate: Date, currentDate: Date, timeInterval: TimeInterval): boolean {
        const expirationDate = this.addTimeInterval(questionDate, timeInterval);
        return currentDate > expirationDate;
    }

    static getLastSatDateText(controlSystemsAndStuff: ControlSystemAndStuff[]): string {
        const date = this.getLastSatDate(controlSystemsAndStuff);
        if(date === null) {
            return "Never Tested";
        }
        return date.toDateString();
    }

    static getControlSystemsAndStuff(
        furnace: Furnace, 
        controlSystems: Record<string, ControlSystem>, 
        controlSystemTypes: Record<string, ControlSystemType>,
        instrumentModels: Record<string, InstrumentModel>,
        instruments: Record<string, Instrument>,
        thermocouples: Record<string, Thermocouple>,
        baseMetalTypes: Record<string, BaseMetalType>)
        : ControlSystemAndStuff[]
    {
        const furnaceControlSystems = furnace.controlSystems;
        const list = furnaceControlSystems.map(v => this.getControlSystemsAndStuffFromFurnaceControlSystem(furnace, v, controlSystems, controlSystemTypes, instrumentModels, instruments, thermocouples, baseMetalTypes));
        const withoutNulls = list.filter(v => v !== null);
        return withoutNulls;
    }

    static getControlSystemsAndStuffFromFurnaceControlSystem(
        furnace: Furnace,
        furnaceControlSystem: FurnaceControlSystem,
        controlSystems: Record<string, ControlSystem>, 
        controlSystemTypes: Record<string, ControlSystemType>,
        instrumentModels: Record<string, InstrumentModel>,
        instruments: Record<string, Instrument>,
        thermocouples: Record<string, Thermocouple>,
        baseMetalTypes: Record<string, BaseMetalType>
    ): ControlSystemAndStuff | null {
        const controlSystem = controlSystems[furnaceControlSystem.controlSystemId];
        if(controlSystems === undefined) {
            return null;
        }
        const instrument = instruments[controlSystem.instrumentId];
        const controlSystemType = controlSystemTypes[controlSystem.controlSystemTypeId];
        if(instrument === undefined || controlSystemType === undefined) {
            return null;
        }
        const instrumentModel = instrumentModels[instrument.instrumentModelId];
        const thermocouple = thermocouples[controlSystem.thermocoupleId];
        if(thermocouple === undefined) {
            return null;
        }
        const baseMetalType = baseMetalTypes[thermocouple.baseMetalTypeId];
        if(baseMetalType === undefined) {
            return null;
        }
        return {furnace, furnaceControlSystem, controlSystem, instrument, controlSystemType, instrumentModel, thermocouple, baseMetalType};
    }

    static getNonSoftwareControlSystems(controlSystemsAndStuff: ControlSystemAndStuff[]): ControlSystemAndStuff[] {
        return controlSystemsAndStuff.filter(v => !v.instrumentModel.isSoftware);
    }

    static getLastSatDate(controlSystemsAndStuff: ControlSystemAndStuff[]): Date | null {
        const nonSoftware = this.getNonSoftwareControlSystems(controlSystemsAndStuff);
        const satTests = nonSoftware.flatMap(v => v.furnaceControlSystem.satTests).filter(v => v.passed);
        const sortedByEndTime = _.sortBy(satTests, v => new Date(v.endTime));
        const last = _.last(sortedByEndTime);
        if(last === undefined || !last.passed) {
            return null;
        }
        const ret = new Date(last.endTime);
        return ret;
    }

    static getOperatingRangeString(furnace: Furnace, options: LoadEntryOptions): string {
        return furnace.minTemperature + " - " + furnace.maxTemperature + " " + options.temperatureUnit + "°";
    }

    static getInstrumentationTypeFromFurnace(furnace: Furnace, instrumentationTypes: Record<string, InstrumentationType>): InstrumentationType {
        const ret = instrumentationTypes[furnace.instrumentationTypeId];
        if(ret === undefined) {
            return this.getDefaultInstrumentationType();
        }
        return ret;
    }

    static getDefaultInstrumentationType(): InstrumentationType {
        return {
            instrumentationTypeId: 0,
            name: "",
            isBaseStandard: false,
            isActive: false,
            isHierarchy: false,
            controlSystems: [],
            subInstrumentationTypes: []
        };
    }

    static getFurnaceClassFromFurnace(furnace: Furnace, furnaceClasses: Record<string, FurnaceClass>): FurnaceClass {
        const ret = furnaceClasses[furnace.furnaceClassId];
        if(ret === undefined) {
            return this.getDefaultFurnaceClass();
        }
        return ret;
    }

    static getDefaultFurnaceClass(): FurnaceClass {
        return {
            furnaceClassId: 0,
            name: "",
            temperatureUniformityFahrenheit: 0,
            temperatureUniformityCelsius: 0,
            satRulesets: [],
            tusRulesets: [],
            isHierarchy: true,
            isBaseStandard: true,
            isActive: true
        };
    }
}