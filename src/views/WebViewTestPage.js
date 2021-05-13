import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewTestPage = () => {
    return (
        //<WebView source={{ uri: "file:///android_asset/matt-try.html" }} />
        <WebView
        style={{flex: 1}}
        originWhitelist={['*']}
        source={{uri:'file:///android_asset/index.html'}}
        style={{ marginTop: 20 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    //   <WebView
    //     style={{flex: 1}}
    //     originWhitelist={['*']}
    //     source={{uri:'http://192.168.1.80:8080/'}}
    //     style={{ marginTop: 20 }}
    //     javaScriptEnabled={true}
    //     domStorageEnabled={true}
    //   />
    );
  };
  
export default WebViewTestPage;