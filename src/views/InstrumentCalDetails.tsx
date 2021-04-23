import React, {useState} from 'react'
import { View, Text, FlatList } from 'react-native';
import _ from 'lodash';
import { ControlSystemAndStuff, InstrumentChannelCalibration } from '../DataStructures';
import PyroLogic from '../PyroLogic';

const InstrumentCalDetails = ({ route, navigation }) =>  {

    const controlSystemAndStuff = route.params.controlSystemAndStuff as ControlSystemAndStuff;
    const instrumentChannelCalibration = route.params.instrumentChannelCalibration as InstrumentChannelCalibration;
    const values = _.sortBy(instrumentChannelCalibration.values, v => new Date(v.testTemperature));

    return (
      <View>
        <Text>Instrument Cal Details:</Text>
        <Text>{"Control System: " + controlSystemAndStuff.controlSystem.name}</Text>
        <Text>{"Channel: " + controlSystemAndStuff.controlSystem.channel}</Text>
        <Text>{"Description: " + controlSystemAndStuff.instrument.description}</Text>
        <Text>{"Serial #: " + (controlSystemAndStuff.instrument.serialNumber === null ? "" : controlSystemAndStuff.instrument.serialNumber)}</Text>
        <Text>{"Model: " + controlSystemAndStuff.instrumentModel.name}</Text>
        <Text>{"Date: " + PyroLogic.convertUtcDateToLocalString12(new Date(instrumentChannelCalibration.calibrationDate))}</Text>
        <Text>{"Outside provider: " + instrumentChannelCalibration.outsideProvider}</Text>
        <View style={{marginTop: 15}}/>
        <Text>Results:</Text>
        <Text>{"Result: " + instrumentChannelCalibration.passed ? "Passed" : "Failed"}</Text>
        <View style={{marginTop: 15}}/>
        <Text>Values:</Text>
        <FlatList
          data={values}
          renderItem={({item}) =>
          <View>
            <Text>{"test temperature: " + item.testTemperature}</Text>
            <Text>{"actual reading: " + item.actualReading}</Text>
            <Text>{"allowable difference: " + item.allowableDifference}</Text>
            <View style={{marginTop: 15}}/>
          </View>}
          />
      </View>
    );
  }

export default InstrumentCalDetails;