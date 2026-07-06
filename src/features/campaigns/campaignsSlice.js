import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { campaignsApi, announcementsApi } from '../../services/api.js';

// Kampanyaların tamamını API üzerinden çeker
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await campaignsApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch campaigns');
    }
  }
);

// Yeni kampanya ekleme isteği gönderir
export const addCampaign = createAsyncThunk(
  'campaigns/add',
  async (campData, { rejectWithValue }) => {
    try {
      const response = await campaignsApi.create(campData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add campaign');
    }
  }
);

// Kampanya detaylarını veya durumunu günceller
export const updateCampaign = createAsyncThunk(
  'campaigns/update',
  async (campData, { rejectWithValue }) => {
    try {
      const response = await campaignsApi.update(campData.id, campData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update campaign');
    }
  }
);

// Kampanyayı listeden tamamen siler
export const deleteCampaign = createAsyncThunk(
  'campaigns/delete',
  async (id, { rejectWithValue }) => {
    try {
      await campaignsApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete campaign');
    }
  }
);

// Duyuruların (Notice board) tamamını çeker
export const fetchAnnouncements = createAsyncThunk(
  'campaigns/fetchAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await announcementsApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch announcements');
    }
  }
);

// Yeni duyuru ekleyip tüm şubelere yayınlar
export const addAnnouncement = createAsyncThunk(
  'campaigns/addAnnouncement',
  async (annData, { rejectWithValue }) => {
    try {
      const response = await announcementsApi.create(annData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add announcement');
    }
  }
);

// Yayındaki bir duyuruyu kaldırır/siler
export const deleteAnnouncement = createAsyncThunk(
  'campaigns/deleteAnnouncement',
  async (id, { rejectWithValue }) => {
    try {
      await announcementsApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete announcement');
    }
  }
);

// Kampanya ve duyuru durum yönetimi başlangıç değerleri
const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: {
    items: [],
    announcements: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Kampanyaları listeleme işlemleri
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Kampanya ekleme işlemleri
      .addCase(addCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Kampanya güncelleme işlemleri
      .addCase(updateCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Kampanya silme işlemleri
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Duyuruları listeleme işlemleri
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Duyuru yayınlama işlemleri
      .addCase(addAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements.unshift(action.payload);
      })
      .addCase(addAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Duyuru silme işlemleri
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = state.announcements.filter(ann => ann.id !== action.payload);
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default campaignsSlice.reducer;
