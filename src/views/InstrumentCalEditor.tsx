import React, {useState} from 'react';
import { useImmer } from "use-immer";
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements';
import _ from 'lodash';
import { ControlSystemAndStuff, Specification, LoadEntryOptions } from '../DataStructures';
import PyroLogic from '../PyroLogic';
import { selectOptions } from '../redux-stuff/furnacesSlice';

//trying some editor data structures.
interface CalibrationValue {
  key: number,
  testTemperature: string,
  actualReading: string,
  allowableDifference: string
}

interface EditorState {
  calibrationValues: CalibrationValue[]
}

const getNewEditorState = () => {
  return {calibrationValues:[]} as EditorState;
}

let key = 0;
const getNewCalibrationValue = () => {
  key++;
  return {
    key: key,
    testTemperature: '0',
    actualReading: '0',
    allowableDifference: '0'
  } as CalibrationValue;
}

const InstrumentCalEditor = ({ route, navigation }) =>  {

  const options = useSelector(selectOptions) as LoadEntryOptions;

  const [editorState, updateEditorState] = useImmer(getNewEditorState());

  const controlSystemAndStuff = route.params.controlSystemAndStuff as ControlSystemAndStuff;
  const specificationsFromFurnace = route.params.specificationsFromFurnace as Specification[];
  const rulesets = PyroLogic.getInstrumentRulesets(controlSystemAndStuff, specificationsFromFurnace);

  const addValue = () => {
    updateEditorState(draft => {
      draft.calibrationValues.push(getNewCalibrationValue());
    });
  };

  const onChangeTestTemperature = (key: number, newValue: string) => {
    updateEditorState(draft => {
      const value = _.find(draft.calibrationValues, v => v.key === key);
      value.testTemperature = newValue;
    });
  };

  const onChangeActualReading = (key: number, newValue: string) => {
    updateEditorState(draft => {
      const value = _.find(draft.calibrationValues, v => v.key === key);
      value.actualReading = newValue;
    });
  };

  const onChangeAllowableDifference = (key: number, newValue: string) => {
    updateEditorState(draft => {
      const value = _.find(draft.calibrationValues, v => v.key === key);
      value.allowableDifference = newValue;
    });
  };

  return (
    <View>
      <Text>Instrument Cal Editor:</Text>
      <Text>{"Control System: " + controlSystemAndStuff.controlSystem.name}</Text>
      <Text>{"Channel: " + controlSystemAndStuff.controlSystem.channel}</Text>
      <Text>{"Description: " + controlSystemAndStuff.instrument.description}</Text>
      <Text>{"Serial #: " + (controlSystemAndStuff.instrument.serialNumber === null ? "" : controlSystemAndStuff.instrument.serialNumber)}</Text>
      <Text>{"Model: " + controlSystemAndStuff.instrumentModel.name}</Text>
      {/* <Text>{"Date: " + PyroLogic.convertUtcDateToLocalString12(new Date(instrumentChannelCalibration.calibrationDate))}</Text> */}
      {/* <Text>{"Outside provider: " + instrumentChannelCalibration.outsideProvider}</Text> */}
      <View style={{marginTop: 15}}/>
      <Text>Results:</Text>
      {/* <Text>{"Result: " + instrumentChannelCalibration.passed ? "Passed" : "Failed"}</Text> */}
      <View style={{marginTop: 15}}/>
      <Button
            title="add value"
            onPress={addValue}
            type="outline" />
      <Text>Values:</Text>
      <FlatList
        data={editorState.calibrationValues}
        renderItem={({item}) =>
        {
          const testTemperatureFloat = parseFloat(item.testTemperature);
          return <View>
          <Text>{"test temperature: "}</Text> 
          <TextInput
            style={styles.input}
            onChangeText={(newValue) => onChangeTestTemperature(item.key, newValue)}
            value={item.testTemperature}
            placeholder="test temperature"
            keyboardType="numeric"
          />
          <Text>{"actual reading: "}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(newValue) => onChangeActualReading(item.key, newValue)}
            value={item.actualReading}
            placeholder="actual reading"
            keyboardType="numeric"
          />
          <Text>{"allowable difference: " + PyroLogic.getAllowableInstrumentDifference(rulesets, testTemperatureFloat, 0, options)}</Text>
          <View style={{marginTop: 15}}/>
        </View>;
        }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 3,
    borderWidth: 1,
  },
});

export default InstrumentCalEditor;