import axios from 'axios';
import { 
  ControlSystem, 
  Furnace, 
  FurnaceClass, 
  InstrumentationType, 
  LoadEntryOptions, 
  InstrumentModel,
  ControlSystemType,
  Instrument,
  Specification,
  TimeInterval,
  Thermocouple,
  BaseMetalType
 } from '../DataStructures';

async function doGet(path) {
  const response = await axios.get(path);
  return response.data;
}

const ipAddress = '192.168.1.55';

export default class SsiApiClient {
  
  static async getFurnaces(): Promise<Furnace[]> {
    return doGet(`http://${ipAddress}:56697/api/furnaces`);
  }

  static async getInstrumentationTypes(): Promise<InstrumentationType[]> {
    return doGet(`http://${ipAddress}:56697/api/instrumentationTypes`);
  }
  
  static async getFurnaceClasses(): Promise<FurnaceClass[]> {
    return doGet(`http://${ipAddress}:56697/api/furnaceClasses`);
  }
  
  static async getOptions(): Promise<LoadEntryOptions> {
    return doGet(`http://${ipAddress}:56697/api/options`);
  }
  
  static async getInstrumentModels(): Promise<InstrumentModel[]> {
    return doGet(`http://${ipAddress}:56697/api/instrumentModels`);
  }
  
  static async getInstruments(): Promise<Instrument[]> {
    return doGet(`http://${ipAddress}:56697/api/instruments`);
  }
  
  static async getControlSystems(): Promise<ControlSystem[]> {
    return doGet(`http://${ipAddress}:56697/api/controlSystems`);
  }
  
  static async getControlSystemTypes(): Promise<ControlSystemType[]> {
    return doGet(`http://${ipAddress}:56697/api/controlSystemTypes`);
  }
  
  static async getSpecifications(): Promise<Specification[]> {
    return doGet(`http://${ipAddress}:56697/api/specifications`);
  }
  
  static async getTimeIntervals(): Promise<TimeInterval[]> {
    return doGet(`http://${ipAddress}:56697/api/timeIntervals`);
  }
  
  static async getThermocouples(): Promise<Thermocouple[]> {
    return doGet(`http://${ipAddress}:56697/api/thermocouples`);
  }
  
  static async getBaseMetalTypes(): Promise<BaseMetalType[]> {
    return doGet(`http://${ipAddress}:56697/api/baseMetalTypes`);
  }

}
