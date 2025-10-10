import { supabase } from "@/integrations/supabase/client";

// Run this once to update the mutton biryani image
// After running, you can delete this file
export async function updateMuttonBiryaniImage() {
  const { data, error } = await supabase
    .from('menu_items')
    .update({ 
      image_url: 'https://eqsaqcviniucqomymvcg.supabase.co/storage/v1/object/public/menu-images/mutton-biryani-1760108214482.jpg' 
    })
    .eq('id', 'b8a6fa49-aa64-4c8c-aebd-30bf68971ec8')
    .select();

  if (error) {
    console.error('Error updating mutton biryani image:', error);
  } else {
    console.log('✅ Mutton biryani image updated successfully!', data);
  }
  
  return data;
}

// Uncomment the line below and save to run once, then comment it back
// updateMuttonBiryaniImage();
