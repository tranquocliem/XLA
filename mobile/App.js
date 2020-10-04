import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  Dimensions,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Dialog, Portal, Provider } from "react-native-paper";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [resultDialog, setResultDialog] = useState(false);
  const [result, setResult] = useState(null);
  const [loadImageResult, setLoadImageResult] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    if (Number.isNaN(+data) && (data.length < 6 || data.length > 10)) {
      alert("Mã số sinh viên nhận được từ mã QR không hợp lệ!");
    }
    setResultDialog(true);
    setResult(data);
  };

  if (hasPermission === null) {
    return (
      <Text>
        Cần được cấp quyền truy cập vào camera của thiết bị. Đang yêu cầu quyền
        camera từ hệ thống
      </Text>
    );
  }
  if (hasPermission === false) {
    return <Text>Không được cấp quyền camera</Text>;
  }

  return (
    <Provider>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <Button title={"Quết lại"} onPress={() => setScanned(false)} />
        )}

        <Portal>
          <Dialog visible={resultDialog}>
            <Dialog.Title>{result}</Dialog.Title>
            <Dialog.Content>
              <Image
                style={{
                  width:
                    (loadImageResult && Dimensions.get("screen").width / 1.4) ||
                    0,
                  height:
                    (loadImageResult &&
                      (Dimensions.get("screen").width * 4) / 3 / 1.4) ||
                    0,
                  justifyContent: "center",
                }}
                source={{
                  uri: `http://student.nctu.edu.vn/GetImage.aspx?MSSV=${result}`,
                }}
                onLoadStart={() => {
                  setIsLoadingImage(true);
                }}
                onLoadEnd={() => {
                  setLoadImageResult(true);
                  setIsLoadingImage(false);
                }}
              ></Image>
              {!loadImageResult && isLoadingImage && (
                <Text style={{ fontSize: 20 }}>
                  Không tìm thấy ảnh của sinh viên này!
                </Text>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setResultDialog(false);
                  setLoadImageResult(null);
                }}
                title="Đóng"
              />
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}
