package sealights.notes.sealights;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FunctionsTest {

    private void sleep(int seconds) {
        try {
            Thread.sleep(seconds * 1000); // Convert seconds to milliseconds
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Test
    void testSubtraction() {
        sleep(20); // 20-second delay
        assertEquals(1, functions.subtracttwonumbers(3, 2));
    }

    @Test
    void testMultiplication() {
        sleep(20); // 20-second delay
        assertEquals(6, functions.multiplytwonumbers(2, 3));
    }

    @Test
    void testDivision() {
        sleep(20); // 20-second delay
        assertEquals(2.0, functions.dividetwonumbers(4, 2));
    }

    @Test
    void testDivisionByZero() {
        sleep(20); // 20-second delay
        assertThrows(IllegalArgumentException.class, () -> functions.dividetwonumbers(4, 0));
    }
}
