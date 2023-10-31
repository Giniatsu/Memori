"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, Button, Label, TextInput } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import TheAvatar from "./Avatar";

export default function AccountForm({ session }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [contact, setContact] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, contact, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setContact(data.contact);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username, contact, avatar_url }) {
    try {
      setLoading(true);

      let { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        full_name: fullname,
        username,
        contact,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-4">
      <Card className="w-4/5 max-w-sm mb-20">
        <TheAvatar
          uid={user.id}
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile({ fullname, username, contact, avatar_url: url });
          }}
        />
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            required
            type="email"
            value={session?.user.email}
            disabled
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="fullName" value="Full Name" />
          </div>
          <TextInput
            id="fullName"
            type="text"
            value={fullname || ""}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="contact" value="Contact Number" />
          </div>
          <TextInput
            id="contact"
            type="text"
            value={contact || ""}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <div>
          {loading ? (
            <Button
            className="mx-auto"
              isProcessing
              processingSpinner={
                <AiOutlineLoading className="h-6 w-6 animate-spin" />
              }
              onClick={() =>
                updateProfile({ fullname, username, contact, avatar_url })
              }
              disabled={loading}
            >
              Updating...{" "}
            </Button>
          ) : (
            <Button className="mx-auto"
              onClick={() =>
                updateProfile({ fullname, username, contact, avatar_url })
              }
            >
              Update
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
