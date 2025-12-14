# 🧬 NSMP Endometrial Cancer Risk Assessment Platform

This project is a **clinical decision-support prototype** for patients with **non-specific molecular profile (NSMP) endometrial cancer**.
It combines two complementary modeling approaches:

1. **A survival-based predictive model** to estimate disease-free survival over time
2. **A Bayesian Network–based probabilistic model** to support reasoning under uncertainty and exploratory analysis

The platform is composed of:

* a **FastAPI backend** (Python) serving both models
* a **Node.js frontend** for clinician interaction and visualization

---

## 📁 Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── apis/
│   │   ├── schemas/
│   │   └── main.py
│   ├── src/
│   │   ├── utils/
│   │   ├── training/ 
│   ├── model/
│   │   ├── cox_model.pkl
│   │   ├── preprocess.json
│   │   ├── risk_thresholds.json
│   │   ├── feature_importance.json
│   │   └── km_curves.json
│   │   └── ...
│   ├── Pipfile
│   └── Pipfile.lock
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json / yarn.lock
│   └── src/
│   └── public/
│   └── node_modules/
│
└── README.md
```

---

## 🚀 Backend (FastAPI)

### 🔧 Requirements

* Python **3.10+**
* `pipenv`

If you do not have pipenv installed:

```bash
pip install pipenv
```

---

### 📦 Install backend dependencies

From the `backend/` directory:

```bash
cd backend
pipenv install
```

---

### ▶️ Run the backend server

Activate the virtual environment:

```bash
pipenv shell
```

Start the FastAPI server:

```bash
python run.py
```

The backend will be available at:

```
http://127.0.0.1:8000
```

Swagger documentation:

```
http://127.0.0.1:8000/docs
```

---

## 🖥️ Frontend (Node.js)

### 🔧 Requirements

* **Node.js 18+**
* npm or yarn

Check your Node version:

```bash
node --version
```

---

### 📦 Install frontend dependencies

From the `frontend/` directory:

```bash
cd frontend
npm install
```

or with yarn:

```bash
yarn install
```

---

### ▶️ Run the frontend

```bash
npm run dev
```

or:

```bash
yarn dev
```

The frontend will typically be available at:

```
http://localhost:3000
```

---

## 🔗 Backend ↔ Frontend connection

The frontend expects the backend at:

```
http://127.0.0.1:8000
```

If needed, configure this via an environment variable in the frontend (e.g. `.env`):

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🧠 Models overview

This platform provides **two complementary modeling approaches**, each serving a different clinical purpose.

---

### 1️⃣ Survival Model: Cox Proportional Hazards

#### Description

The primary model is a **Cox proportional hazards survival model**, trained on NSMP endometrial cancer patients to estimate **disease-free survival (DFS)** after treatment.

It integrates routinely collected:

* clinical variables
* pathological features
* biomarker information

to provide interpretable risk estimates over time.

#### Outputs

* **Relative risk score** (unitless, comparative)
* **Risk group**: Low / Medium / High (based on training population quantiles)
* **Predicted DFS probabilities** at:

  * 1 year
  * 3 years
  * 5 years
* **Feature importance** (hazard ratios)
* **Kaplan–Meier survival curves** by predicted risk group

#### Interpretation

* The risk score reflects **relative recurrence risk compared to the reference population**, not an absolute probability.
* DFS probabilities represent the estimated probability of remaining disease-free at clinically relevant time points.
* This model is intended to **support risk stratification and follow-up planning**, and should be interpreted alongside clinical guidelines and multidisciplinary judgment.

---

### 2️⃣ Probabilistic Model: Bayesian Network–Based Risk Assessment

#### Description

The second model is an **experimental Bayesian Network**, a probabilistic graphical model that represents **conditional dependencies** between clinical, pathological, and biomarker variables.

Instead of focusing on a single predefined outcome, the Bayesian Network models the **joint probability distribution** of all variables and enables flexible inference under uncertainty.

#### Key characteristics

* **Probabilistic reasoning** with explicit uncertainty representation
* **Flexible inference targets**: any variable in the network can be queried
* **Support for partial evidence**: inference is possible even when some variables are missing
* **Causal reasoning phenomena**, such as *explaining away*
* **Dynamic probability updating** as new evidence becomes available

#### Outputs

* Marginal probability distributions
* Conditional probability distributions given observed evidence

#### Interpretation and use

This model is intended for:

* exploratory analysis
* hypothesis generation
* reasoning under uncertainty

It is **not designed to produce deterministic risk predictions**. Probabilities should be interpreted as conditional on the available evidence and the learned network structure.

The current network is a **demonstration model learned from data and simplified assumptions**. Its clinical utility can be enhanced by incorporating expert knowledge, such as validated causal relationships and structural constraints.

---

## 🔍 Relationship between the two models

The two models serve **distinct but complementary roles**:

| Cox Survival Model             | Bayesian Network                          |
| ------------------------------ | ----------------------------------------- |
| Predictive                     | Exploratory                               |
| Time-to-event focused          | Probability-focused                       |
| Fixed outcome (DFS)            | Flexible inference targets                |
| Produces risk groups           | Produces conditional probabilities        |
| Optimized for decision support | Optimized for reasoning under uncertainty |

Together, they illustrate how **predictive modeling and probabilistic reasoning** can coexist within a single clinical decision-support platform.

---

## ⚠️ Important note

Both models are intended to **support**, not replace, clinical decision-making.
All outputs must be interpreted in conjunction with multidisciplinary clinical judgment and current clinical guidelines.

No patient data is stored or persisted by the system.

