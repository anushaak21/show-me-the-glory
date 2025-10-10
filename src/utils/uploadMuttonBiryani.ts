import { supabase } from "@/integrations/supabase/client";
import muttonBiryaniImage from "@/assets/mutton-biryani.jpg";

export async function uploadMuttonBiryaniImage() {
  try {
    // Fetch the image as a blob
    const response = await fetch(muttonBiryaniImage);
    const blob = await response.blob();
    
    // Upload to Supabase Storage
    const fileName = `mutton-biryani-${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName);

    // Update the menu item
    const { error: updateError } = await supabase
      .from('menu_items')
      .update({ image_url: publicUrl })
      .eq('id', 'b8a6fa49-aa64-4c8c-aebd-30bf68971ec8'); // Mutton Biryani ID

    if (updateError) {
      console.error('Update error:', updateError);
      return null;
    }

    console.log('Successfully updated mutton biryani image!');
    return publicUrl;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
