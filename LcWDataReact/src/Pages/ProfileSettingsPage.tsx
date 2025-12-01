// src/Pages/ProfileSettingsPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useParams } from "react-router-dom";

// ====== CONFIG ======
const API_BASE = "https://localhost:44322/api/Customer";

// ====== STYLED COMPONENTS ======
const PageWrap = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 1200,
  margin: "0 auto",
  padding: theme.spacing(4, 2),
}));

const Layout = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "280px 1fr",
  gap: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

const Side = styled(Card)(({ theme }) => ({
  height: "fit-content",
  position: "sticky",
  top: theme.spacing(2),
}));

const Content = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(3),
}));

const Section = styled(Card)(({ theme }) => ({
  borderRadius: 16,
}));

// ====== TYPES ======
type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type Address = {
  id: number;
  title: string;
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault?: boolean;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

// ====== HELPERS ======
const namePattern = /^[A-Za-zÇĞİÖŞÜçğıöşü\s'-]{2,}$/;
const phonePattern = /^(\+?\d{1,3})?0?\d{10}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwdStrong = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

// Token'ı eklemek istersen hazır dursun (backend şu an authorize istemiyor gibi)
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export default function ProfileSettingsPage() {
  const [tab, setTab] = useState(0);
  const [snack, setSnack] = useState<string | null>(null);

  const { id: routeId } = useParams<{ id?: string }>();
  const lsUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const effectiveId = routeId || lsUserId || null; // KAYIT/GET/PUT için tek kaynak

  // ---- User (backend'den)
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // ---- Profile form
  const {
    control: pControl,
    handleSubmit: handleProfile,
    formState: { errors: pErrors, isSubmitting: pSaving },
    reset: resetProfileForm,
  } = useForm<ProfileForm>({
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
    mode: "onBlur",
  });

  // Kullanıcıyı çek
  useEffect(() => {
    (async () => {
      if (!effectiveId) {
        setSnack("Kullanıcı id bulunamadı (giriş yapın).");
        setUserLoading(false);
        return;
      }
      try {
        const safeId = encodeURIComponent(String(effectiveId));
        const { data } = await axios.get<User>(`${API_BASE}/profile/${safeId}`, {
          headers: { ...authHeader() },
        });
        setUser(data);
        resetProfileForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
        });
      } catch (e: any) {
        console.error("Profil alınamadı:", e?.response?.status, e?.response?.data);
        setSnack(`Profil alınamadı${e?.response?.status ? ` (HTTP ${e.response.status})` : ""}.`);
      } finally {
        setUserLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]); // route değişirse yeniden yükle

  const greeting = user ? `Hoş geldiniz, ${user.firstName}` : "";

  // --- PROFİL KAYDET -> AYNI ID İLE PUT
  const onSaveProfile: SubmitHandler<ProfileForm> = async (form) => {
    try {
      if (!effectiveId) throw new Error("Kullanıcı id bulunamadı.");
      // Backend Customer modeline uygun alan adları yolluyoruz
      await axios.put(
        `${API_BASE}/profile/${encodeURIComponent(String(effectiveId))}`,
        {
          name: form.firstName,
          surname: form.lastName,
          email: form.email,
          phoneNo: form.phone,
        },
        { headers: { "Content-Type": "application/json", ...authHeader() } }
      );

      setSnack("Profil bilgileri güncellendi.");
      // local state'i güncelle
      setUser((u) =>
        u
          ? {
              ...u,
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              phone: form.phone,
            }
          : u
      );
      // İstersen sağ menüde görünen adı güncel tut:
      if (form.firstName) localStorage.setItem("userName", form.firstName);
    } catch (e: any) {
      setSnack(e?.response?.data ?? e?.message ?? "Profil güncellenemedi. Lütfen tekrar deneyin.");
    }
  };

  // ---- Password form (backend'de endpoint yoksa pasif bırak)
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const {
    control: sControl,
    handleSubmit: handleSecurity,
    watch,
    formState: { errors: sErrors, isSubmitting: sSaving },
  } = useForm<PasswordForm>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });
  const newPwd = watch("newPassword");
  const onSavePassword: SubmitHandler<PasswordForm> = async () => {
    setSnack("Parola güncelleme servisi henüz bağlı değil.");
  };

  // ---- Notifications (örnek, backend'e bağlayınca PUT at)
  const [notif, setNotif] = useState({ email: true, sms: false, marketing: false, orderUpdates: true });
  const saveNotif = async () => {
    setSnack("Bildirim tercihleri örnek olarak kaydedildi (backend bağlı değil).");
  };

  // ---- Addresses (lokal demo)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: "Ev",
      line1: "Esentepe Mah. Örnek Sk. No:10",
      city: "İstanbul",
      district: "Şişli",
      postalCode: "34394",
      isDefault: true,
    },
  ]);
  const [addrOpen, setAddrOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const startAdd = () => {
    setEditing(null);
    setAddrOpen(true);
  };
  const startEdit = (a: Address) => {
    setEditing(a);
    setAddrOpen(true);
  };
  const removeAddr = (id: number) => {
    setAddresses((prev) => prev.filter((x) => x.id !== id));
    setSnack("Adres silindi.");
  };
  const saveAddress = async (a: Omit<Address, "id"> & { id?: number }) => {
    setAddresses((prev) => {
      if (a.id) return prev.map((x) => (x.id === a.id ? (a as Address) : x));
      const id = prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1;
      return [...prev, { ...(a as Address), id }];
    });
    setSnack("Adres kaydedildi.");
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setSnack("Çıkış yapıldı.");
  };

  const tabs = useMemo(
    () => [
      { label: "Profil", idx: 0 },
      { label: "Güvenlik", idx: 1 },
      { label: "Adresler", idx: 2 },
      { label: "Bildirimler", idx: 3 },
      { label: "Hesap", idx: 4 },
    ],
    []
  );

  return (
    <PageWrap>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Hesap Ayarları
      </Typography>

      <Layout>
        {/* LEFT */}
        <Side variant="outlined">
          <CardContent>
            <Stack alignItems="center" spacing={1.2}>
              <Avatar sx={{ width: 84, height: 84 }}>{user?.firstName?.[0] ?? "U"}</Avatar>

              {userLoading ? (
                <>
                  <Skeleton variant="text" width={220} height={24} />
                  <Skeleton variant="text" width={180} height={18} />
                </>
              ) : (
                <>
                  <Typography fontWeight={700} textAlign="center">
                    {greeting}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </>
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Tabs orientation="vertical" value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
              {tabs.map((t) => (
                <Tab key={t.idx} label={t.label} />
              ))}
            </Tabs>
          </CardContent>
        </Side>

        {/* RIGHT */}
        <Content>
          {/* PROFILE */}
          {tab === 0 && (
            <Section variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Profil Bilgileri
                </Typography>

                <Box component="form" onSubmit={handleProfile(onSaveProfile)} noValidate>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <Controller
                      name="firstName"
                      control={pControl}
                      rules={{
                        required: "Ad zorunludur",
                        pattern: { value: namePattern, message: "Ad yalnızca harf içermeli (min 2 karakter)" },
                      }}
                      render={({ field }) => (
                        <TextField {...field} label="Ad" error={!!pErrors.firstName} helperText={pErrors.firstName?.message} fullWidth />
                      )}
                    />
                    <Controller
                      name="lastName"
                      control={pControl}
                      rules={{
                        required: "Soyad zorunludur",
                        pattern: { value: namePattern, message: "Soyad yalnızca harf içermeli (min 2 karakter)" },
                      }}
                      render={({ field }) => (
                        <TextField {...field} label="Soyad" error={!!pErrors.lastName} helperText={pErrors.lastName?.message} fullWidth />
                      )}
                    />
                  </Stack>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={2}>
                    <Controller
                      name="email"
                      control={pControl}
                      rules={{
                        required: "E-posta zorunludur",
                        pattern: { value: emailPattern, message: "Geçerli e-posta girin" },
                      }}
                      render={({ field }) => (
                        <TextField {...field} label="E-posta" type="email" error={!!pErrors.email} helperText={pErrors.email?.message} fullWidth />
                      )}
                    />
                    <Controller
                      name="phone"
                      control={pControl}
                      rules={{
                        required: "Telefon zorunludur",
                        pattern: { value: phonePattern, message: "Geçerli bir telefon girin (11 haneli)" },
                      }}
                      render={({ field }) => (
                        <TextField {...field} label="Telefon" placeholder="05XXXXXXXXX" error={!!pErrors.phone} helperText={pErrors.phone?.message} fullWidth />
                      )}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2} mt={3}>
                    <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={pSaving}>
                      Kaydet
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Section>
          )}

          {/* SECURITY */}
          {tab === 1 && (
            <Section variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Güvenlik
                </Typography>
                <Box component="form" onSubmit={handleSecurity(onSavePassword)} noValidate>
                  <Stack spacing={2}>
                    <Controller
                      name="currentPassword"
                      control={sControl}
                      rules={{ required: "Mevcut parola zorunludur" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type={showPwd.current ? "text" : "password"}
                          label="Mevcut Parola"
                          error={!!sErrors.currentPassword}
                          helperText={sErrors.currentPassword?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPwd((s) => ({ ...s, current: !s.current }))} edge="end">
                                  {showPwd.current ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="newPassword"
                      control={sControl}
                      rules={{
                        required: "Yeni parola zorunludur",
                        pattern: { value: pwdStrong, message: "En az 8 karakter, 1 büyük harf ve 1 rakam içermelidir" },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type={showPwd.next ? "text" : "password"}
                          label="Yeni Parola"
                          error={!!sErrors.newPassword}
                          helperText={sErrors.newPassword?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPwd((s) => ({ ...s, next: !s.next }))} edge="end">
                                  {showPwd.next ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="confirmPassword"
                      control={sControl}
                      rules={{
                        required: "Parola tekrarı zorunludur",
                        validate: (v) => v === newPwd || "Parolalar eşleşmiyor",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type={showPwd.confirm ? "text" : "password"}
                          label="Yeni Parola (Tekrar)"
                          error={!!sErrors.confirmPassword}
                          helperText={sErrors.confirmPassword?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPwd((s) => ({ ...s, confirm: !s.confirm }))} edge="end">
                                  {showPwd.confirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    <Stack direction="row" spacing={2}>
                      <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={sSaving}>
                        Parolayı Güncelle
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </CardContent>
            </Section>
          )}

          {/* ADDRESSES */}
          {tab === 2 && (
            <Section variant="outlined">
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="h6" fontWeight={700}>
                    Adreslerim
                  </Typography>
                  <Button variant="contained" startIcon={<AddLocationAltIcon />} onClick={startAdd}>
                    Yeni Adres
                  </Button>
                </Stack>
                <List>
                  {addresses.map((a) => (
                    <ListItem key={a.id} divider>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={600}>{a.title}</Typography>
                            {a.isDefault && (
                              <Typography variant="caption" color="primary" sx={{ border: "1px solid", px: 0.8, borderRadius: 1 }}>
                                Varsayılan
                              </Typography>
                            )}
                          </Stack>
                        }
                        secondary={`${a.line1}${a.line2 ? ", " + a.line2 : ""} • ${a.district}/${a.city} ${a.postalCode}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => startEdit(a)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => removeAddr(a.id)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Section>
          )}

          {/* NOTIFICATIONS */}
          {tab === 3 && (
            <Section variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Bildirim Tercihleri
                </Typography>
                <Stack spacing={1.5}>
                  <RowSwitch
                    label="Sipariş durumu güncellemeleri (önerilir)"
                    checked={notif.orderUpdates}
                    onChange={(v) => setNotif((s) => ({ ...s, orderUpdates: v }))}
                  />
                  <RowSwitch label="E-posta bildirimleri" checked={notif.email} onChange={(v) => setNotif((s) => ({ ...s, email: v }))} />
                  <RowSwitch label="SMS bildirimleri" checked={notif.sms} onChange={(v) => setNotif((s) => ({ ...s, sms: v }))} />
                  <RowSwitch label="Kampanya ve pazarlama iletileri" checked={notif.marketing} onChange={(v) => setNotif((s) => ({ ...s, marketing: v }))} />
                </Stack>

                <Stack direction="row" spacing={2} mt={2}>
                  <Button variant="contained" onClick={saveNotif} startIcon={<SaveIcon />}>
                    Kaydet
                  </Button>
                </Stack>
              </CardContent>
            </Section>
          )}

          {/* ACCOUNT */}
          {tab === 4 && (
            <Section variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Hesap
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Hesabınızı silerseniz sipariş geçmişiniz, adresleriniz ve favorileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
                      Çıkış Yap
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => setSnack("Hesap silme akışı: TODO")}>
                      Hesabı Sil
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Section>
          )}
        </Content>
      </Layout>

      <AddressDialog
        open={addrOpen}
        onClose={() => setAddrOpen(false)}
        initial={editing || undefined}
        onSave={(a) => {
          saveAddress(a);
          setAddrOpen(false);
        }}
      />

      <Snackbar
        open={!!snack}
        message={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </PageWrap>
  );
}

// ====== SUB-COMPONENTS ======
function RowSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography>{label}</Typography>
      <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </Stack>
  );
}

function AddressDialog({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Address;
  onSave: (a: Omit<Address, "id"> & { id?: number }) => void;
}) {
  const isEdit = !!initial;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Address, "id"> & { id?: number }>({
    defaultValues: initial || {
      title: "",
      line1: "",
      line2: "",
      city: "",
      district: "",
      postalCode: "",
      isDefault: false,
    },
  });

  const submit: SubmitHandler<Omit<Address, "id"> & { id?: number }> = async (data) => {
    await fakeWait();
    onSave({ ...data, id: initial?.id });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Adresi Düzenle" : "Yeni Adres"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Başlık zorunludur" }}
            render={({ field }) => (
              <TextField {...field} label="Başlık (Ev, İş vb.)" error={!!errors.title} helperText={errors.title?.message} fullWidth />
            )}
          />
          <Controller
            name="line1"
            control={control}
            rules={{ required: "Adres satırı zorunludur" }}
            render={({ field }) => (
              <TextField {...field} label="Adres Satırı 1" error={!!errors.line1} helperText={errors.line1?.message} fullWidth />
            )}
          />
          <Controller name="line2" control={control} render={({ field }) => <TextField {...field} label="Adres Satırı 2 (opsiyonel)" fullWidth />} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              name="city"
              control={control}
              rules={{ required: "Şehir zorunludur" }}
              render={({ field }) => (
                <TextField {...field} label="Şehir" error={!!errors.city} helperText={errors.city?.message} fullWidth />
              )}
            />
            <Controller
              name="district"
              control={control}
              rules={{ required: "İlçe zorunludur" }}
              render={({ field }) => (
                <TextField {...field} label="İlçe" error={!!errors.district} helperText={errors.district?.message} fullWidth />
              )}
            />
            <Controller
              name="postalCode"
              control={control}
              rules={{ required: "Posta kodu zorunludur", pattern: { value: /^\d{5}$/, message: "5 haneli posta kodu" } }}
              render={({ field }) => (
                <TextField {...field} label="Posta Kodu" error={!!errors.postalCode} helperText={errors.postalCode?.message} fullWidth />
              )}
            />
          </Stack>
          <RowSwitch
            label="Varsayılan adres yap"
            checked={!!(initial?.isDefault ?? false)}
            onChange={() => {
              if (initial) initial.isDefault = !initial.isDefault;
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Vazgeç</Button>
        <Button variant="contained" onClick={handleSubmit(submit)} disabled={isSubmitting}>
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Küçük bir bekleme simülasyonu
async function fakeWait(ms = 600) {
  await new Promise((r) => setTimeout(r, ms));
}
