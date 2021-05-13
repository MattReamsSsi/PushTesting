import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewTestPage = () => {
    return (
            <WebView
                source={{ uri: 'https://logrocket.com/' }}
                style={{ marginTop: 20 }}
            />
    );
  };
  
export default WebViewTestPage;