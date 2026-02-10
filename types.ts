
export interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  bio: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
