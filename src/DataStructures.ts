export interface BaseMetalType {
    baseMetalTypeId: number;
    name: string;
    isNobleMetal: boolean;
    isActive: boolean;
    isBaseStandard: boolean;
}

export interface Thermocouple {
    thermocoupleId: number;
    thermocoupleClassificationId: number;
    serialNumber: string;
    description: string;
    thermocoupleManufacturerId: number;
    baseMetalTypeId: number;
    isExpendable: boolean;
    calibrationIntervalId: number;
    // calibrationInterval: null,
    // dateOfFirstUse: null,
    // dateDecomissioned: null,
    hasBeenConfigured: boolean;
    isActive: boolean;
    calibrations: ThermocoupleCalibration[];
}

export interface ThermocoupleCalibration {
    id: string;
    thermocoupleId: number;
    calibrationDate: string;
    user: string;
    isActive: boolean;
    passed: boolean;
    outsideProvider: boolean;
    enterValues: boolean;
    //document: null;
    hasSaved: boolean;
    isFixedPointCalibration: boolean;
    values: ThermocoupleCalibrationValues[];
}

export interface ThermocoupleCalibrationValues {
    id: string;
    calibrationId: string;
    testTemperature: number;
    actualReading: number;
    allowableDifference: number;
    isActive: boolean;
}

//below is specification stuff
export interface Specification {
    specificationId: number;
    furnaceClasses: SpecificationFurnaceClass[];
    instrumentationTypes: SpecificationInstrumentationType[];
    instrumentCalibrationRulesets: InstrumentCalibrationRuleset[];
    thermocoupleCalibrationRulesets: ThermocoupleCalibrationRuleset[];
    name: string;
    isBaseStandard: boolean;
    isActive: boolean;
}

export interface InstrumentCalibrationRuleset {
    id: string;
    specificationId: number;
    furnaceClassId: number;
    instrumentTypeId: number;
    maxCalibrationIntervalId: number;
    instrumentClassificationId: number;
    calibrationAccuracyFahrenheit: number;
    calibrationAccuracyCelsius: number;
    percentDifference: number;
    useMaximumSurveyTemperatureOfFurnace: boolean;
    minimumNumberOfValues: number;
    isActive: boolean;
}

export interface ThermocoupleCalibrationRuleset {
    id: string;
    specificationId: number;
    furnaceClassId: number;
    thermocoupleClassificationId: number;
    baseMetalTypeId: number;
    calibrationIntervalId: number;
    useTemperatureRanges: false,
    tempUnitId: number;
    startOfTemperatureRange: number;
    endOfTemperatureRange: number;
    calibrationAccuracyFahrenheit: number;
    calibrationAccuracyCelsius: number;
    percentDifference: number;
    temperatureRangeIntervalCelsius: number;
    temperatureRangeIntervalFahrenheit: number;
    hasSaved: boolean;
    isActive: boolean;
}

export interface SpecificationFurnaceClass {
    specificationId: number;
    furnaceClassId: number;
    isActive: boolean;
}

export interface SpecificationInstrumentationType {
    specificationId: number;
    instrumentationTypeId: number;
    isActive: boolean;
}




export interface Instrument {
    instrumentId: number;
    instrumentTypeId: number;
    instrumentClassificationId: number;
    instrumentManufacturerId: number;
    calibrationIntervalId: number;
    instrumentModelId: number;
    serialNumber: string;
    description: string;
    isActive: boolean;
    hasSaved: boolean;
    channels: InstrumentChannel[],
    // "specifications": []
}

export interface InstrumentChannel {
    instrumentId: number;
    channel: number;
    isActive: boolean;
    calibrations: InstrumentChannelCalibration[];
}

export interface InstrumentChannelCalibrationValues {
    id: string;
    calibrationId: string;
    testTemperature: number;
    actualReading: number;
    allowableDifference: number;
    isActive: boolean;
}

export interface InstrumentChannelCalibration {
    id: string;
    instrumentChannelInstrumentId: number;
    instrumentChannelChannel: number;
    user: string;
    calibrationDate: string;
    isActive: boolean;
    passed: boolean;
    outsideProvider: boolean;
    enterValues: boolean;
    hasSaved: boolean;
    values: InstrumentChannelCalibrationValues[]
}

export interface InstrumentModel {
    instrumentModelId: number;
    manufacturerId: number;
    name: string;
    isActive: boolean;
    isSoftware: boolean;
    isSSiInstrumentModel: boolean;
    isBaseStandard: boolean;
}



//added by Matt
export enum PyroStatus {
    invalid,
    valid,
    notCalibratable
}

//added by Matt
export interface ControlSystemAndStuff {
    furnace: Furnace;
    furnaceControlSystem: FurnaceControlSystem; 
    controlSystem: ControlSystem; 
    instrument: Instrument;
    controlSystemType: ControlSystemType; 
    instrumentModel: InstrumentModel;
    thermocouple: Thermocouple;
    baseMetalType: BaseMetalType;
}



//FurnaceClass stuff here
export interface FurnaceClass {
    furnaceClassId: number;
    name: string;
    temperatureUniformityFahrenheit: number;
    temperatureUniformityCelsius: number;
    satRulesets: SatRuleset[];
    tusRulesets: TusRuleset[]
    // "subFurnaceClasses": [],
    isHierarchy: boolean;
    isBaseStandard: boolean;
    isActive: boolean;
}

export interface SatRuleset {
    id: string;
    furnaceClassId: number;
    instrumentationTypeId: number;
    normalTestIntervalId: number;
    normalTestInterval: TimeInterval;
    extendedTestIntervalId: number;
    extendedTestInterval: TimeInterval;
    maximumSATTemperatureDifferenceFahrenheit: number;
    maximumSATTemperatureDifferenceCelsius: number;
    maximumSATTemperatureDifferencePercentOfReading: number;
    maximumSATTemperatureAdjustmentFahrenheit: number;
    maximumSATTemperatureAdjustmentCelsius: number;
    maximumSATTemperatureAdjustmentPercentMaxTemperature: number;
    isActive: boolean;
    isParts: boolean;
}

export interface TusRuleset {
    id: string;
    furnaceClassId: number;
    instrumentationTypeId: number;
    instrumentationType: InstrumentationType;
    normalTestIntervalId: number;
    normalTestInterval: TimeInterval;
    numberOfConsecutiveSuccessfulTUSRequiredForExtendedInterval: number;
    extendedTestIntervalId: number;
    extendedTestInterval: TimeInterval;
    isActive: boolean;
    isParts: boolean;
}

export interface TimeInterval {
    timeIntervalId: number;
    name: string;
    days: number;
    weeks: number;
    months: number;
    years: number;
    hasSaved: boolean;
    isBaseStandard: boolean;
    isActive: boolean;
}





//InstrumentationType stuff here
export interface InstrumentationTypeControlSystem {
    instrumentationTypeId: number;
    controlSystemTypeId: number;
    index: number;
    isActive: boolean;
}
export interface SubInstrumentationType {
    instrumentationTypeId: number;
    subInstrumentationTypeId: number;
    isActive: boolean;
}
export interface InstrumentationType {
    instrumentationTypeId: number;
    name: string;
    isBaseStandard: boolean;
    isActive: boolean;
    isHierarchy: boolean;
    controlSystems: InstrumentationTypeControlSystem[];
    subInstrumentationTypes: SubInstrumentationType[];
}


export enum InstrumentModelEnum {
    HC900,
    SSi9005 = 9005,
    SSi9010 = 9010,
    SSi9015 = 9015,
    SSi9130 = 9130,
    SSi9150 = 9150,
    SSi9200 = 9200,
    SSi9205 = 9205,
    SSi9215 = 9215,
    SSi9220 = 9220,
    MatrixSegment,
    MatrixStep
}

export interface FurnaceControlSystemTUSTest {
    id: string;
    furnaceId: string;
    furnaceClassId: number;
    controlSystemId: number;
    startTime: string;
    endTime: string;
    user: string;
    passed: boolean;
    document: string;
    isActive: boolean;
}

export interface SATTestType {
    satTestTypeId: number;
    name: string;
    isActive: boolean;
    isBaseStandard: boolean;
    id: string;
}

export interface FurnaceControlSystemSATTest {
    id: string;
    satTestTypeId: number;
    satTestType: SATTestType[];
    furnaceId: string;
    furnaceClassId: number;
    controlSystemId: number;
    controlZone: number;
    startTime: string;
    endTime: string;
    selectedTestThermocoupleId: number;
    user: string;
    thermocoupleInsertionDepth: number;
    furnaceSetPoint: number;
    instrumentReading: number;
    correctionFactorInstrument: number;
    correctionFactorThermocouple: number;
    correctionFactorTUSOffset: number;
    testInstrumentReading: number;
    testInstrumentCorrectionFactor: number;
    testSensorCorrectionFactor: number;
    correctedInstrumentTemperature: number;
    trueTestTemperature: number;
    satDifference: number;
    passed: boolean;
    outsideProvider: boolean;
    enterValues: boolean;
    document: string;
    isActive: boolean;
}

export interface ControlSystem {
    controlSystemId: number;
    controlSystemTypeId: number;
    thermocoupleId: number;
    instrumentId: number;
    channel: number;
    name: string;
    isActive: boolean;
}

export interface ControlSystemType {
    controlSystemTypeId: number;
    name: string;
    isActive: boolean;
    isBaseStandard: boolean;
}

export interface FurnaceControlSystem {
    furnaceId: string;
    controlSystemId: number;
    isActive: boolean;
    controlZone: number;
    satTests: FurnaceControlSystemSATTest[];
    tusTests: FurnaceControlSystemTUSTest[];
    id: string;
}

export interface FurnaceSpecification {
    furnaceId: string;
    specificationId: number;
    isActive: boolean;
    id: string;
}

export enum FurnaceType {
    Batch,
    Temper
}

export interface Furnace {
    isFurnace: boolean;
    canHaveMultiple: boolean;
    loadPrefix: string;
    id: string;
    isActive: boolean;
    name: string;
    connectionId: string;
    type: FurnaceType[];
    specifications: FurnaceSpecification[];
    controlSystems: FurnaceControlSystem[];
    trendName: string;
    maxWeight: number;//-1 Disables
    minWeight: number;//-1 Disables
    maxTemperature: number;//-1 Disables
    minTemperature: number;//-1 Disables
    visualShopEquipmentId: number;//-1 Disables
    isVisualShopIntegrated: boolean;
    isManual: boolean;
    xPosition: number;
    yPosition: number;
    routingId: number;
    furnaceClassId: number;
    instrumentationTypeId: number;
    numberOfControlZones: number;
    furnaceUsePyrometry: boolean;
    isPartsFurnace: boolean;
    isUnderMaintenanceProgram: boolean;

    //Controller Information
    model: InstrumentModelEnum;
    sppType: string;
    programmerNumber: number;
    customTextPath: string;
    customOpcodePath: string;

    useRecipeDisplayOptions: boolean;
    useSppType: boolean;
    atmosphereUnits: string;
    atmosphereDecimals: number;
}


export interface LoadEntryOptions {
    usePyrometry: boolean;
    displayWorkOrderCompletedSteps: boolean;
    pickListLimit: number;
    displayStatusColor: boolean;
    useExternalDatabase: boolean;
    viewTrendDefaultOffset: boolean;
    includeScopes: boolean;
    logLevel: string;
    connectionString: string;
    dataProviderURL: string;
    dataProviderType: string;
    usePartsDb: boolean;
    useLoadSchedule: boolean;
    unscheduledRecipeDuration: number;
    scheduleLoadBuffer: number;
    useGapTime: boolean;
    useWorkorderApproval: boolean;
    loginLimitMinutes: number;
    loginLimitEnabled: boolean;
    temperatureUnit: string;
    weightUnit: string;
    disableWeight: boolean;
    exportToXml: boolean;
    startOffset: number;
    endOffset: number;
    customerLogo: string;
    sSiLogo: string;
    useCustomerLogo: boolean;
    useSSiLogo: boolean;
    useRegisterDefinition: boolean;
    useWorkOrderNameGenerator: boolean;
    requirePictureToStartLoad: boolean;
    displayFurnacePrefixLoadIdentifier: boolean;
    workOrderNameFormatId: string;
    useEnterPartSerialNumbers: boolean;
    useActiveDirectory: boolean;
    showRecipeProfileView: boolean;
    minimumPartQuantityPercent: number;
    useMinimumPartQuantity: boolean;
    exportFurnaceName: boolean;
    exportOperationName: boolean;
    exportRecipeName: boolean;
    exportWorkOrders: boolean;
    exportTotalWeight: boolean;
    exportStartDate: boolean;
    exportTotalRunTime: boolean;
}