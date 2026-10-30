"""Local-review arithmetic checks. Run: python3 scripts/checks/september-queues.py.
No dependency; independent finite-ledger, stationary-sum and event simulation checks.
"""
import math
import random
rng = random.Random(202609)
for _ in range(500):
    spacing = rng.uniform(1, 5)
    arrivals = [i * spacing for i in range(4)]
    departures = []
    last = 0
    for a in arrivals:
        last = max(last, a) + 3
        departures.append(last)
    events = sorted([(a, 1) for a in arrivals] + [(d, -1) for d in departures])
    area = 0
    occupancy = 0
    previous = 0
    for time, change in events:
        area += occupancy * (time - previous)
        occupancy += change
        previous = time
    residence = sum(d - a for a, d in zip(arrivals, departures))
    assert math.isclose(area, residence, abs_tol=1e-10)
    assert math.isclose(area / last, (4 / last) * (residence / 4))
    rho = rng.uniform(.01, .95)
    mu = rng.uniform(.1, 100)
    # Geometric distribution independently summed to negligible residual.
    nmax = math.ceil(math.log(1e-16) / math.log(rho))
    probabilities = [(1-rho)*rho**n for n in range(nmax+1)]
    assert math.isclose(sum(probabilities), 1, abs_tol=1e-12)
    L = sum(n * v for n, v in enumerate(probabilities))
    assert math.isclose(L, rho/(1-rho), rel_tol=1e-10)
    assert math.isclose(L/(rho*mu), 1/(mu-rho*mu), rel_tol=1e-10)
for rho, expected in [(.5,.2),(.8,.5),(.9,1)]:
    assert math.isclose(1/(10*(1-rho)), expected)
    arrival = departure = total = 0
    # One million independent Poisson/exponential jobs, first 20k discarded.
    for i in range(1_020_000):
        arrival += rng.expovariate(10*rho)
        departure = max(arrival, departure) + rng.expovariate(10)
        if i >= 20_000:
            total += departure-arrival
    estimate = total/1_000_000
    assert abs(estimate/expected-1)<.06, (rho,estimate,expected)
    print(f'rho={rho}: simulated W={estimate:.6f}s; exact={expected}s; tolerance6%')
assert sum([3,4,5,6])==18
assert 18/12==1.5 and 18/4==4.5
print('PASS:500 random ledgers and stationary sums;3 independent million-job simulations; all printed examples')
