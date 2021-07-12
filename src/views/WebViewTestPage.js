import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { renderToString } from 'react-dom/server';

const WebViewTestPage = () => {

  const domString = renderToString(<DomComponent/>);
  console.log("domString:" + domString);

  // const myScript = `
  //     window.globalIpAddress = 192.168.1.88;
  //     true;
  //   `;

    return (
        // <WebView source={{ uri: "file:///android_asset/matt-try.html" }} />
      //   <WebView
      //   style={{flex: 1}}
      //   originWhitelist={['*']}
      //   source={{uri:'file:///android_asset/index.html'}}
      //   style={{ marginTop: 20 }}
      //   javaScriptEnabled={true}
      //   domStorageEnabled={true}
      //   onMessage={event => {
      //     alert(event.nativeEvent.data);
      //   }}
      // />
      // <WebView source={{ html: domString }}></WebView>
      // <View>
        <WebView
        style={{flex: 1}}
        originWhitelist={['*']}
        source={{uri:'http://192.168.1.88:3000/'}}
        style={{ marginTop: 20 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={event => {
            alert(event.nativeEvent.data);
          }}
          injectedJavaScriptBeforeContentLoaded={`window.ipAddress = "192.168.1.88"`}
      />
      
    );
  };

const DomComponent = () => {
  return (
    <div>
      <h2>something</h2>
    </div>
  );
}
  
export default WebViewTestPage;