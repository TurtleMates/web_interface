const API_BASE = `${process.env.NEXT_PUBLIC_ROS_API_URL}/api/v1`;

export async function fetchTopics() {
  try {
    const res = await fetch(`${API_BASE}/topics`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchTopicSnapshot(topic: string) {
  try {
    const res = await fetch(`${API_BASE}/topics/${encodeURIComponent(topic)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function sendCmdVel(linear_x: number, angular_z: number) {
  try {
    const res = await fetch(`${API_BASE}/control/cmd_vel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linear_x, angular_z })
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function sendStop() {
  try {
    const res = await fetch(`${API_BASE}/control/stop`, { method: 'POST' });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function sendNavGoal(x: number, y: number, yaw: number, frame_id: string = "map") {
  try {
    const res = await fetch(`${API_BASE}/navigation/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, yaw, frame_id, behavior_tree: "" })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function cancelNavGoal(goal_id: string) {
  try {
    const res = await fetch(`${API_BASE}/navigation/goals/${goal_id}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function sendInitialPose(x: number, y: number, yaw: number, frame_id: string = "map") {
  try {
    const res = await fetch(`${API_BASE}/localization/initial-pose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, yaw, frame_id })
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function resumeExploration(resume: boolean) {
  try {
    const res = await fetch(`${API_BASE}/exploration/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume })
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}
