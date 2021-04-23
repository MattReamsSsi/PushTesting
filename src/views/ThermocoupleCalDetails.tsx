import React, {useState} from 'react'
import { View, Text, FlatList } from 'react-native';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { selectOptions } from '../redux-stuff/furnacesSlice';
import { ControlSystemAndStuff, ThermocoupleCalibration, Specification, LoadEntryOptions } from '../DataStructures';
import PyroLogic from '../PyroLogic';

const ThermcoupleCalDetails = ({ route, navigation }) =>  {

  const options = useSelector(selectOptions) as LoadEntryOptions;

  const controlSystemAndStuff = route.params.controlSystemAndStuff as ControlSystemAndStuff;
  const thermocoupleCalibration = route.params.thermocoupleCalibration as ThermocoupleCalibration;
  const specificationsFromFurnace = route.params.specificationsFromFurnace as Specification[];
  const rulesets = PyroLogic.getThermocoupleRulesets(controlSystemAndStuff, specificationsFromFurnace);
  const values = _.sortBy(thermocoupleCalibration.values, v => new Date(v.testTemperature));

  return (
    <View>
      <Text>Thermocouple Cal Details:</Text>
      <Text>{"Control System: " + controlSystemAndStuff.controlSystem.name}</Text>
      <Text>{"Description: " + controlSystemAndStuff.thermocouple.description}</Text>
      <Text>{"Serial #: " + (controlSystemAndStuff.thermocouple.serialNumber === null ? "" : controlSystemAndStuff.thermocouple.serialNumber)}</Text>
      <Text>{"Metal Type: " + controlSystemAndStuff.baseMetalType.name}</Text>
      <Text>{"Date: " + PyroLogic.convertUtcDateToLocalString12(new Date(thermocoupleCalibration.calibrationDate))}</Text>
      <Text>{"Outside provider: " + thermocoupleCalibration.outsideProvider}</Text>
      <View style={{marginTop: 15}}/>
      <Text>Results:</Text>
      <Text>{"Result: " + thermocoupleCalibration.passed ? "Passed" : "Failed"}</Text>
      <View style={{marginTop: 15}}/>
      <Text>Values:</Text>
      <FlatList
        data={values}
        renderItem={({item}) =>
        <View>
          <Text>{"test temperature: " + item.testTemperature}</Text>
          <Text>{"actual reading: " + item.actualReading}</Text>
          <Text>{"allowable difference: " + PyroLogic.getAllowableThermocoupleDifference(rulesets, item.testTemperature, item.allowableDifference, options)}</Text>
          <View style={{marginTop: 15}}/>
        </View>}
        />
    </View>
  );
}

export default ThermcoupleCalDetails;