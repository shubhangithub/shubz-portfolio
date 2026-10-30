"""Verify October's discrete toy model, including arbitrary initial histories.
Run: python3 scripts/checks/october-feedback.py. No external dependency.
"""
import cmath
import math
import random
rng=random.Random(202610)
def roots(k):
    d=cmath.sqrt(1-4*k)
    return ((1+d)/2,(1-d)/2)
def trajectory(k,previous,current,count=40):
    values=[current]
    for _ in range(count):
        previous,current=current,current-k*previous
        values.append(current)
    return values
for k in [0,.25,1,1.2]+[rng.uniform(-.5,2.5) for _ in range(1000)]:
    z1,z2=roots(k)
    for z in [z1,z2]:
        assert abs(z*z-z+k)<1e-12
    assert abs(z1*z2-k)<1e-12
    if abs(k)>1e-10 and abs(k-1)>1e-10:
        assert (max(abs(z1),abs(z2))<1)==(0<k<1)
    previous,current=rng.uniform(-2,2),rng.uniform(-2,2)
    values=trajectory(k,previous,current)
    first=current-k*previous
    if abs(z1-z2)<1e-10:
        A=current
        B=first/z1-A
        formula=lambda t:(A+B*t)*z1**t
    else:
        A=(first-z2*current)/(z1-z2)
        B=current-A
        formula=lambda t:A*z1**t+B*z2**t
    for t,v in enumerate(values):
        assert abs(v-formula(t))<1e-7*max(1,abs(v))
    if k>.25:
        assert math.isclose(abs(z1),math.sqrt(k),rel_tol=1e-12)
assert all(math.isclose(a,b,abs_tol=1e-12) for a,b in zip(trajectory(.8,1,1,3),[1,.2,-.6,-.76]))
assert all(math.isclose(.2**t,v,abs_tol=1e-12) for t,v in enumerate([1,.2,.04,.008]))
v=trajectory(1,1,1,30)
assert v[:7]==[1,0,-1,-1,0,1,1]
assert all(v[t]==v[t+6] for t in range(24))
assert math.isclose(math.sqrt(1.2),1.095,abs_tol=.0005)
assert math.isclose(1-1.2,-.2)
for k in [rng.uniform(-1,3) for _ in range(1000)]:
    assert (abs(1-k)<1)==(0<k<2)
print('PASS:1004 root/recurrence comparisons with40 steps and random initial histories;1000 immediate stability checks; repeated root; six-step boundary cycle; all numeric examples')
