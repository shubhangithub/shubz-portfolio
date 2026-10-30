/** Context is interface state, not additional biographical copy. */
export type PixelScene = 'office' | 'writing' | 'journal' | 'collection' | 'network' | 'contact' | 'article';
export type PixelPose = 'reading' | 'investigating' | 'carrying';
export const PIXEL_SCENES: Record<PixelScene, { label:string; status:string; pose:PixelPose }> = {
 office: { label:'At the desk', status:'Keeping the notes within paw’s reach.', pose:'investigating' },
 writing: { label:'At the workbench', status:'Reading over your shoulder.', pose:'reading' },
 journal: { label:'Beside the journal', status:'Keeping a paw on this page.', pose:'reading' },
 collection: { label:'In the collection', status:'Inspecting the small parts.', pose:'investigating' },
 network: { label:'In the network', status:'Following the connections.', pose:'investigating' },
 contact: { label:'With the letter', status:'Ready to carry a note.', pose:'carrying' },
 article: { label:'In the margin', status:'Reading along.', pose:'reading' },
};
export const PIXEL_COPY = {
 settings:'Pixel’s controls', controls:'Controls', resting:'Resting here. Your place is safe.',
 quiet:'Quietly keeping you company.', name:'Pixel', model:'PX–01',
};
