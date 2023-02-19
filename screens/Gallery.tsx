import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraProps } from "expo-camera";

import {
  doc,
  setDoc,
  onSnapshot,
  query,
  collection,
  orderBy,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

import { BoldText, View } from "../components/Themed";
import Colors from "../constants/Colors";
import Container from "../components/Container";
import Loader from "../components/Loader";
import useColorScheme from "../hooks/useColorScheme";

import { styles } from "../themes";

export default function TabTwoScreen() {
  const [posts, setPosts] = useState<Array<DocumentData>>([]);
  const colorScheme = useColorScheme();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [camera, setCamera] = useState<CameraProps | null>(null);
  const [toEdit, setToEdit] = useState<{ id?: string; date?: Date } | null>(
    null
  );
  const [progress, setProgress] = useState(0);

  const { currentUser } = getAuth();
  const storage = getStorage();

  async function getMediaPermission() {
    if (Constants.platform?.ios) {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

      if (status != "granted") {
        alert("Permission needed to access media gallery");
      }
    }
  }

  async function getCameraPermission() {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    if (!cameraStatus.granted) {
      alert("Permission needed to access camera");
    }
  }

  const pickImage = async (id?: string, date?: Date) => {
    // No permissions request is necessary for launching the image library

    setToEdit({ id: id, date: date });

    let result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUploading(true);
      await uploadPhoto();
      setUploading(false);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const savePostData = async (url: string, id?: string | null) => {
    if (id) {
      const imageRef = doc(
        db,
        "posts/",
        `${currentUser?.uid}`,
        `userPosts/${id}`
      );
      await updateDoc(imageRef, {
        path: url,
      })
        .then(() => {
          setSaving(false);
          setToEdit(null);
          setImage(null);
        })
        .catch((error) => alert(error));
    } else {
      await setDoc(
        doc(
          db,
          "posts",
          `${currentUser?.uid}`,
          `userPosts/${Math.random().toString(36)}`
        ),
        {
          path: url,
          date: Date.now(),
        }
      )
        .then(() => {
          setSaving(false);
          setImage(null);
        })
        .catch((error) => alert(error));
    }
  };

  async function uploadPhoto() {
    if (image && currentUser) {
      // upload it to firestore
      const res = await fetch(image);
      const blob = await res.blob();
      const storageRef = ref(
        storage,
        `images/${currentUser?.uid}/${Math.random().toString(36)}.jpg`
      );

      setUploading(true);
      const task = uploadBytesResumable(storageRef, blob);

      task.on(
        "state_changed",
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => console.log(error),
        () => {
          setUploading(false);
          setSaving(true);
          getDownloadURL(task.snapshot.ref).then((url) => {
            savePostData(url, toEdit?.id);
          });
        }
      );
    }
  }

  useEffect(() => {
    getCameraPermission();
    getMediaPermission();

    const q = query(
      collection(db, "posts", `${currentUser?.uid}`, "userPosts"),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setPosts((prev) => {
          const i = prev.findIndex((post) => post.id === doc.id);

          if (i >= 0) {
            let newP = [...prev];
            newP[i] = {
              ...prev[i],
              path: doc.data().path,
            };
            return newP;
          }

          const addedPost = { id: doc.id, ...doc.data() };
          return [addedPost, ...prev];
        });
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <StatusBar backgroundColor={Colors[colorScheme].background} />
      {(uploading || saving) && <Loader progress={progress} />}
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <BoldText style={{ marginBottom: 10 }}>Gallery</BoldText>

        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: Dimensions.get("screen").width - 25,
              height: Dimensions.get("screen").width,
              marginBottom: 10,
            }}
          />
        )}

        {/* Render Image Grid */}

        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            data={posts}
            extraData={posts}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: (Dimensions.get("screen").width - 30) / 3,
                  margin: 1,
                  flexDirection: "column",
                }}
                activeOpacity={0.7}
                onLongPress={() => pickImage(item.id, item.date)}
              >
                <Image
                  style={{
                    opacity: item.id === toEdit?.id ? 0.7 : 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: (Dimensions.get("screen").width - 40) / 3,
                  }}
                  source={{ uri: item.path }}
                />
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          ...styles.uploadBtn,
          backgroundColor:
            saving || uploading
              ? Colors[colorScheme].tabIconDefault
              : Colors[colorScheme].tint,
        }}
        onPress={() => (image ? uploadPhoto() : pickImage())}
      >
        {!image ? (
          <AntDesign name="picture" size={20} color="white" />
        ) : saving || uploading ? (
          <ActivityIndicator size={"small"} color="white" />
        ) : (
          <AntDesign name="upload" size={20} color="white" />
        )}
      </TouchableOpacity>
    </Container>
  );
}
