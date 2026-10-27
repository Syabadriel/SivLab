---
description: How to deploy LabInventory on a Proxmox VE server
---

# Deploying LabInventory on Proxmox VE (LXC + Nginx)

Since LabInventory is a frontend-only React application built using Vite, it produces static assets (`dist` folder) that can be served via a lightweight Web Server. The most efficient way to deploy this on Proxmox VE is using a Linux Container (LXC) with **Nginx**.

## Step 1: Create an LXC Container on Proxmox

1. Log in to your **Proxmox VE Web UI**.
2. Download a CT Template if you haven't already:
   - Go to your storage node -> **CT Templates** -> **Templates** -> select **debian-12-standard** or **ubuntu-22.04-standard** -> Click **Download**.
3. Click **Create CT** (top-right corner):
   - **General**: Set hostname (e.g. `lab-inventory`) and set root password.
   - **Template**: Choose the downloaded Debian/Ubuntu template.
   - **Root Disk**: 8 GB is plenty.
   - **CPU**: 1 or 2 vCPUs.
   - **Memory**: 512 MB or 1 GB RAM.
   - **Network**: Set Bridge to `vmbr0` and configure IPv4 (either DHCP or a Static IP, e.g. `192.168.1.50/24` with your gateway).
4. Finish wizard and **Start** the container.

---

## Step 2: Install Nginx inside the LXC Container

1. Open the LXC console in Proxmox.
2. Update the package list and install Nginx:
   ```bash
   apt update && apt install -y nginx UFW
   ```
3. Allow HTTP/HTTPS traffic through the firewall:
   ```bash
   ufw allow 'Nginx Full'
   ufw enable
   ```

---

## Step 3: Compile the Project Locally

Before uploading the files, build the application with your production Supabase environment variables embedded:

1. Open `.env.production` or `.env.local` on your local development machine and insert the live Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-proj-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-actual-clean-public-key
   ```
2. Build the static bundle:
   ```bash
   npm run build
   ```
3. This creates a `dist/` directory in your root folder.

---

## Step 4: Transfer Built Files to the LXC Container

Transfer the contents of your local `dist/` directory to the LXC container's web directory (`/var/www/html/`).

You can use **SCP** or **SFTP**:
```bash
# Execute from your local project root:
scp -r dist/* root@<LXC-CONTAINER-IP>:/var/www/html/
```

---

## Step 5: Configure Nginx for Client-Side Routing (SPA)

Because this application uses React Router, Nginx needs to route all requested paths (e.g. `/inventaris`, `/peminjaman`) back to `index.html`.

1. Inside the LXC Container console, edit the default Nginx site configuration:
   ```bash
   nano /etc/nginx/sites-available/default
   ```
2. Modify the configuration to match this block:
   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;

       root /var/www/html;
       index index.html index.htm;

       server_name _;

       location / {
           # Try to serve file directly, fallback to index.html for SPA routing
           try_files $uri $uri/ /index.html;
       }

       # Enable browser caching for assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```
3. Save and close (Ctrl+O, Enter, Ctrl+X).
4. Verify the Nginx settings and reload the service:
   ```bash
   nginx -t
   systemctl reload nginx
   ```

---

## Step 6: Test Deployment

Open your browser and navigate to `http://<LXC-CONTAINER-IP>`. The login page should render, and you're set to manage your lab inventory!
