# HYPER

![Logo](./hyper.jpg)

## Example Programs

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
SAY "HELLO!"!
```

  </td>
  <td>

```python
print('HELLO!')
```

  </td>
  </tr>
</table>


<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
FUNC fibonacci( INT num ): 
    TRY num EQUAL 0:
        GIMME 0!
    NO?TRY num EQUAL 1 OR num EQUAL 2:
        GIMME 1!
    
    SAY fibonacci(num-2) ADD fibonacci(num-1)!
```

  </td>

  <td>

```python
def fibonacci(num): 
    if num == 0: 
        return 0
    if num == 1 or num == 2:
        return 1
    return fibonacci(num - 2) + fibonacci(num - 1)
```

  </td>

  </tr>
</table>
