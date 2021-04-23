import React, { useState } from 'react'
import { View, Text, FlatList, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements';

import {
  selectControlSystems,
  selectFurnaceClasses,
  selectInstrumentationTypes,
  selectOptions,
  selectInstrumentModels,
  selectControlSystemTypes,
  selectInstruments,
  selectSpecifications,
  selectTimeIntervals,
  selectThermocouples,
  selectBaseMetalTypes
} from '../redux-stuff/furnacesSlice';

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
import PyroLogic from '../PyroLogic';

const PyroDetails = ({ route, navigation }) => {

  const furnace = route.params.furnace as Furnace;
  const instrumentationTypes = useSelector(selectInstrumentationTypes) as Record<string, InstrumentationType>;
  const instrumentationType = PyroLogic.getInstrumentationTypeFromFurnace(furnace, instrumentationTypes);
  const furnaceClasses = useSelector(selectFurnaceClasses) as Record<string, FurnaceClass>;
  const furnaceClass: FurnaceClass = PyroLogic.getFurnaceClassFromFurnace(furnace, furnaceClasses);
  const instrumentModels = useSelector(selectInstrumentModels) as Record<string, InstrumentModel>;
  const instruments = useSelector(selectInstruments) as Record<string, Instrument>;
  const controlSystems = useSelector(selectControlSystems) as Record<string, ControlSystem>;
  const controlSystemTypes = useSelector(selectControlSystemTypes) as Record<string, ControlSystemType>;
  const specifications = useSelector(selectSpecifications) as Record<string, Specification>;
  const specificationsFromFurnace = PyroLogic.getSpecificationsFromFurnace(furnace, specifications);
  const thermocouples = useSelector(selectThermocouples) as Record<string, Thermocouple>;
  const baseMetalTypes = useSelector(selectBaseMetalTypes) as Record<string, BaseMetalType>;
  const timeIntervals = useSelector(selectTimeIntervals) as Record<string, TimeInterval>;
  const options = useSelector(selectOptions) as LoadEntryOptions;

  //this may not be the best way to do it.  I may need to get 'now' from the server.
  //const [now, setNow] = useState(new Date());
  const now = new Date();

  const controlSystemsList = PyroLogic.getControlSystemsAndStuff(furnace, controlSystems, controlSystemTypes, instrumentModels, instruments, thermocouples, baseMetalTypes);

  const satStatus = PyroLogic.getSatStatus(now, furnace, furnaceClass, controlSystemsList, specificationsFromFurnace, timeIntervals);
  const satStatusColor = PyroLogic.getStatusColor(satStatus);
  const tusStatus = PyroLogic.getTusStatus(now, furnace, furnaceClass, controlSystemsList, specificationsFromFurnace, timeIntervals);
  const tusStatusColor = PyroLogic.getStatusColor(tusStatus);

  return (

    <FlatList
      ListHeaderComponent={
        <>
          <Text>Pyro Details:</Text>
          <Text>{"Furnace Name: " + furnace.name}</Text>
          <Text>{"Instrumentation Type: " + instrumentationType.name}</Text>
          <Text>{"Furnace Class: " + furnaceClass.name}</Text>
          <Text>{"Qualified Operating Range: " + PyroLogic.getOperatingRangeString(furnace, options)}</Text>
          <Text>{"Last SAT: " + PyroLogic.getLastSatDateText(controlSystemsList)}</Text>
          <Text>{"Next SAT Date: " + PyroLogic.getNextSatDateText(furnace, furnaceClass, controlSystemsList)}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text>{"SAT Status: "}</Text>
            <View style={{ height: 20, width: 20, backgroundColor: satStatusColor }} />
          </View>
          <Text>{"Last TUS: " + PyroLogic.getLastTusDateText(controlSystemsList)}</Text>
          <Text>{"Next TUS Date: " + PyroLogic.getNextTusDateText(furnace, furnaceClass, controlSystemsList)}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text>{"TUS Status: "}</Text>
            <View style={{ height: 20, width: 20, backgroundColor: tusStatusColor }} />
          </View>
        </>}
      data={controlSystemsList}
      keyExtractor={v => v.controlSystem.controlSystemId.toString()}
      renderItem={({ item }) => {
        const instrumentStatus = PyroLogic.getInstrumentStatus(item, specificationsFromFurnace, timeIntervals, now);
        const instrumentStatusColor = PyroLogic.getStatusColor(instrumentStatus);
        const thermocoupleStatus = PyroLogic.getThermocoupleStatus(item, specificationsFromFurnace, timeIntervals, now);
        const thermocoupleStatusColor = PyroLogic.getStatusColor(thermocoupleStatus);
        const lastInstrumentCalibration = PyroLogic.getLastInstrumentCalibration(item);
        const lastThermocoupleCalibration = PyroLogic.getLastThermocoupleCalibration(item);
        const showPreviousInstrumentCalButton = !item.instrumentModel.isSoftware && lastInstrumentCalibration !== null;
        const showStartInstrumentCalibration = !item.instrumentModel.isSoftware;
        const showLastThermocoupleCalButton = lastThermocoupleCalibration !== null;
        return <View>
          <View style={{ marginTop: 15 }} />
          <Text>Control System:</Text>
          <Text>{"name: " + item.controlSystem.name}</Text>
          <Text>{"type: " + item.controlSystemType.name}</Text>
          <Text>{"instrument: " + item.instrumentModel.name}</Text>
          <Text>{"last instrument cal: " + PyroLogic.getLastInstrumentCalibrationDateText(item)}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text>{"instrument status: "}</Text>
            <View style={{ height: 20, width: 20, backgroundColor: instrumentStatusColor }} />
          </View>
          <Text>{"thermocouple metal type: " + item.baseMetalType.name}</Text>
          <Text>{"last thermocouple cal: " + PyroLogic.getLastThermocoupleCalibrationDateText(item)}</Text>

          <View style={{ flexDirection: 'row' }}>
            <Text>{"thermocouple status: "}</Text>
            <View style={{ height: 20, width: 20, backgroundColor: thermocoupleStatusColor }} />
          </View>

          {showPreviousInstrumentCalButton &&
            <Button
              title="previous instrument cal"
              onPress={() => navigation.navigate('InstrumentCalDetails', { controlSystemAndStuff: item, instrumentChannelCalibration: lastInstrumentCalibration })}
              type="outline" />}

          {showStartInstrumentCalibration &&
            <Button
              title="start instrument cal"
              onPress={() => navigation.navigate('InstrumentCalEditor', { controlSystemAndStuff: item, specificationsFromFurnace })}
              type="outline" />}

          {showLastThermocoupleCalButton &&
            <Button
            title="previous thermocouple cal"
            onPress={() => navigation.navigate('ThermocoupleCalDetails', { controlSystemAndStuff: item, thermocoupleCalibration: lastThermocoupleCalibration, specificationsFromFurnace })}
            type="outline" />}

            

        </View>
      }
      }
    />
  );
}

export default PyroDetails;