import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';
import { Platform } from 'react-native';

export type ImageUploadResult = {
  url: string;
  path: string;
};

export async function pickImage(): Promise<ImagePicker.ImagePickerAsset | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Permission refusée pour accéder aux photos');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
}

export async function uploadImage(
  uri: string,
  bucket: string = 'property-images',
  folder?: string
): Promise<ImageUploadResult> {
  try {
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const path = folder ? `${folder}/${filename}` : filename;

    let fileData: Blob | File;

    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      fileData = await response.blob();
    } else {
      const response = await fetch(uri);
      fileData = await response.blob();
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileData, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('[Image Upload] Error:', error);
      throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('[Image Upload] Failed:', error);
    throw error;
  }
}

export async function uploadMultipleImages(
  uris: string[],
  bucket: string = 'property-images',
  folder?: string
): Promise<ImageUploadResult[]> {
  const uploadPromises = uris.map(uri => uploadImage(uri, bucket, folder));
  return Promise.all(uploadPromises);
}

export async function deleteImage(path: string, bucket: string = 'property-images'): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('[Image Delete] Error:', error);
    throw new Error(error.message);
  }
}
