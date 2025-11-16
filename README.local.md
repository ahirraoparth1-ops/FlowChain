Local run instructions (conda recommended)

1) Backend (recommended: conda)

   # From PowerShell
   cd /d D:\flowchain\forecast-backend
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   # Run the helper script which will try conda then venv
   .\start_backend.ps1

   If you prefer manual steps using conda:
   conda create -n flowchain python=3.10 -y
   conda activate flowchain
   conda install -c conda-forge prophet pandas -y
   pip install fastapi uvicorn python-multipart
   uvicorn main:app --reload --host 0.0.0.0 --port 8000

2) Frontend

   cd /d D:\flowchain\FlowChain
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   .\start_frontend.ps1

3) Test upload (optional)

   From backend folder:
   .\test_upload.ps1 -FilePath '..\FlowChain\src\pages\landing-page\components\sales_data.csv'

Notes & troubleshooting
- If prophet pip install fails on Windows, use conda to install it (`conda install -c conda-forge prophet`).
- If uvicorn shows "Could not import module 'main'", ensure you're running it from `d:\flowchain\forecast-backend` and `main.py` exists there.
- If the frontend shows "failed to fetch", check backend is running and reachable on port 8000 and look at browser devtools network tab for details.
