const onSubmit = async (values) => {
  const formData = new FormData();
  formData.append("avatar", values.avatar);
  formData.append("fullName", values.fullName);
  formData.append("shortDescription", values.shortDescription);
  formData.append("longDescription", values.longDescription);
  if (avatarFile) formData.append("avatarFile", avatarFile);

  const response = await fetch("/api/hero", { method: "PUT", body: formData });
  if (!response.ok)
    throw new Error((await response.json()).message || "Failed to update hero");
  const { data } = await response.json();
  form.reset({
    avatar: data.avatar,
    fullName: data.fullName,
    shortDescription: data.shortDescription,
    longDescription: data.longDescription,
  });
  toast.success("Hero section updated");
};
